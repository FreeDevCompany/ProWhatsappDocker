import { inject, injectable, named } from "inversify"
import { Types } from "../../domain/models/ioc.types"
import { userRequestTypes } from "../../domain/http/Requests.types/user";
import { IResponse } from "../../domain/http/baseResponse.types";
import { IUserDto } from "../../domain/models/user.types";
import { HashHelper } from "../utilities/hashHelper";
import { LogLocation, LogType, LoggerService } from "../../infrastructure/services/loggerService.class";
import { ICacheService } from "../../domain/logic/cacheManager.types.";
import { jwtHandler } from "../../infrastructure/services/jwtHandler.class";
import { LinkHelper } from "../utilities/linkHelper";
import { generateResponse } from "../utilities/responseHelper";
import { RepositoryService } from "../../infrastructure/services/repositoryService.class";
import { IAutomationSettings } from "../../domain/models/autoMationSettings.types";
import { CodeGenerator } from "../utilities/codeGenerator";


@injectable()
export class AuthenticationUseCases {

  private repositoryService: RepositoryService;
  private loggerService: LoggerService;
  private cacheService: ICacheService<{ token: string }>;

  constructor(
    @inject("RepositoryService") repositoryService: RepositoryService,
    @inject(Types.LoggerService) loggerService: LoggerService,
    @inject("ICacheService") cacheService: ICacheService<{ token: string }>
  ) {
    this.loggerService = loggerService;
    this.cacheService = cacheService;
    this.repositoryService = repositoryService;
  }

  private async createUser(body: any) {
    const encryptedPassword = await HashHelper.encrypt(body.password);
    const roleId = (await this.repositoryService.roleRepository.findOne({ roleName: 'User' }))._id;
    const saved = await this.repositoryService.userRepository.create(
      {
        avatar: body.avatar,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        email: body.email,
        password: encryptedPassword,
        extraNumberCount: 0,
        roleId: roleId
      }
    );
    await LinkHelper.SendVerifyEmail(saved.email, saved._id as unknown as string);
    return saved;
  }
  registerUser = async (body: userRequestTypes['REGISTER']): Promise<IResponse<{} | IResponse<IUserDto>>> => {
    try {
      let foundUser = await this.repositoryService.userRepository.findOne({
        $or: [{ email: body.email }, { phone: body.phone }]
      });
      let isHave = await this.repositoryService.extraPhoneRepo.findOne({ phone: body.phone });
      if (isHave) return generateResponse({}, "There is a user registered in the system with this credentials.", "USED_CREDENTIALS", 400);


      if (foundUser) {
        this.loggerService.Log(LogType.WARNING, LogLocation.consoleAndFile,
          "The client is trying to register again with the information registered in the system.");
        return generateResponse({}, "There is a user registered in the system with this credentials.", "USED_CREDENTIALS", 400);
      }

      let saved = await this.createUser(body);
      this.loggerService.Log(LogType.INFO, LogLocation.all, `The email has been sent. A new user has joined us. ${saved._id}`);
      return generateResponse<{}>({}, "Successfully Registered. Email Has been sent for verification.", "GOTO_HOME_PAGE", 201);
    }
    catch (error) {
      this.loggerService.Log(LogType.ERROR, LogLocation.consoleAndFile, error.message);
      return generateResponse<{}>({}, error.message, "", 500);
    }
  }
  verifyEmail = async (body: userRequestTypes["VERIFY_EMAIL"]): Promise<IResponse<{}>> => {
    let isFound = await this.repositoryService.userRepository.getById(body.userId);
    if (!isFound) return generateResponse<{}>({}, "Invalid User.", "", 404);
    if ((isFound.verified === true && isFound.email_hash)) return generateResponse<{}>({}, "Email verification has already been completed.", "LOGIN_REQUIRED", 400);
    let hashCompareVal = `${isFound.email}${isFound._id as unknown as string}`;
    if (!await HashHelper.compare(hashCompareVal, body.email_hash)) return generateResponse<{}>({}, "Email verification has already been completed.", "LOGIN_REQUIRED", 400);


    isFound.verified = true;
    isFound.email_hash = body.email_hash;
    await this.repositoryService.creditRepository.create({
      userId: isFound._id,
      totalAmount: 100,
    })
    let createdData = await this.repositoryService.automationSettingsRepo.create({
      userId: isFound._id,
      beginTime: new Date(),
      max_message_delay: 10,
      min_message_delay: 0,
    } as IAutomationSettings);
    await this.repositoryService.userRepository.update(body.userId, isFound);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${isFound._id as unknown as string}] verified email.`);
    return generateResponse<{}>({}, "Email verified Successfully.", "LOGIN_REQUIRED", 200);
  }

  getForgotPasswordLink = async (body: userRequestTypes["FORGOT_PASSWORD_LINK"]): Promise<IResponse<{}>> => {
    try {
      let isFound = await this.repositoryService.userRepository.findOne({ email: body.email });
      if (!isFound) return generateResponse<{}>({}, "There is no registered user with this email.", "", 400);
      let forgotToken = jwtHandler.signNewToken({
        email: isFound.email,
        id: isFound._id as unknown as string
      }, '5m');
      this.cacheService.setCacheItem(`${body.user_agent}-forgotPass`, { token: forgotToken });
      await LinkHelper.SendForgotPasswordLink(isFound.email, isFound._id as unknown as string, forgotToken);
      this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `Email has been sent to ${isFound._id} for forgot password operation.`);
      return generateResponse<{}>({}, "The email has been sent to your account", "CONFIRM_FORGOT_PASSWROD", 200);

    }
    catch (error) {
      this.loggerService.Log(LogType.ERROR, LogLocation.all, error.message);
      return generateResponse<{}>({}, error.message, "", 500);
    }
  }

  getForgotPasswordConfirm = async (body: userRequestTypes["FORGOT_PASSWORD_CONFIRM"]): Promise<IResponse<{}>> => {
    try {
      let storedForgotPassToken = await this.cacheService.getCacheItem(`${body.user_agent}-forgotPass`);
      if (!storedForgotPassToken) return generateResponse<{}>({}, "Forgot Password time has expired", "", 404);

      let decodedToken: any = jwtHandler.verifyToken(storedForgotPassToken.token);
      if (decodedToken && decodedToken.id && decodedToken.email) {
        let user = await this.repositoryService.userRepository.getById(decodedToken.id);
        if (await HashHelper.compare(body.password, user.password))
          return generateResponse<{}>({}, "The new password cannot be the same as the old password.", "", 400);

        user.password = await HashHelper.encrypt(body.password);
        await this.repositoryService.userRepository.update(decodedToken.id, user);
        this.cacheService.removeCacheItem(`${body.user_agent}-forgotPass`);
        this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `${user._id as unknown as string} has changed his password. [FORGOT PASSWORD]`);
        return generateResponse<{}>({}, "The password has been successfully changed.", "LOGIN_REQUIRED", 200);

      }
    }
    catch (error) {
      return generateResponse<{}>({}, "The time limit for password reset has expired.", "", 404);
    }
  }




  Login = async (body: userRequestTypes["LOGIN"]): Promise<IResponse<{} | IResponse<{ token_info: { token: string, expireDate: Date }, user: IUserDto, role: {} }>>> => {
    let user = await this.repositoryService.userRepository.getAllDataWithPopulate('roleId', 'Role', undefined, body.email) as IUserDto;
    let today = new Date();

    if (!user) return generateResponse<{}>({}, "The email address you entered is not valid", "HOME_PAGE", 404);
    if (!await HashHelper.compare(body.password, user.password)) return generateResponse<{}>({}, "The password you entered is incorrect", "LOGIN_REQUIRED", 400);
    if (user.verified === false) return generateResponse<{}>({}, "You need to verify your e-mail.", "VERIFY_EMAIL", 403);
    if (user.frozenAccount && user.frozenAccount === true) return generateResponse<{ id: string }>({ id: user._id.toString() }, "Your account is frozen. Would you like to reactivate your account?", "FROZEN_ACCOUNT", 401);

    let cacheControl = await this.cacheService.getCacheItem(user._id as unknown as string);
    if (cacheControl) {
      try {
        const storedToken: any = jwtHandler.verifyToken(cacheControl.token);
        if (storedToken.expireDate && storedToken.deviceId) {
          if (new Date(Date.parse(storedToken.expireDate)) > today && !await HashHelper.compare(body.user_agent, storedToken.deviceId))
            return generateResponse<{ id: string }>({ id: storedToken.id },
              "You have an open session. Would you like to end your current session and continue from here?",
              "KILL_SESSION", 409);
          else {
            return generateResponse<{ token: string, expireDate: Date, id: string }>({ token: cacheControl.token, expireDate: storedToken.expireDate, id: storedToken.id }, "Already logged in", "", 200);
          }
        }
      }
      catch (error) {
        this.cacheService.removeCacheItem(user._id as unknown as string);
      }

    }

    const token = jwtHandler.signNewToken({
      id: user._id as unknown as string,
      deviceId: await HashHelper.encrypt(body.user_agent),
      role: user.roleId,
      expireDate: new Date(new Date().setDate(today.getDate() + 7))
    })
    this.cacheService.setCacheItem(user._id as unknown as string, { token });
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${user._id as unknown as string} logged into the system]`);
    return generateResponse<{ id: string, token: string, expireDate: Date }>({
      id: user._id.toString(),
      token: token, expireDate: (new Date(new Date().setDate(today.getDay() + 7)))
    }, "Logging in...", "HOME_PAGE", 200);
  }
  resetSessionAndLogin = async (body: userRequestTypes["RESET_SESSION_LOGIN"]): Promise<IResponse<{} | IResponse<{ token_info: { token: string, expireDate: Date }, user: IUserDto, role: {} }>>> => {
    let user = await this.repositoryService.userRepository.getAllDataWithPopulate('roleId', 'Role', body.id, undefined);
    let today = new Date();

    if (!user) return generateResponse<{}>({}, "Invalid User.", "", 404);
    let cachedData = await this.cacheService.getCacheItem(body.id);
    if (cachedData) {
      try {
        let decodedToken: any = jwtHandler.verifyToken(cachedData.token);
        if (decodedToken.expireDate && decodedToken.deviceId) {
          if (!(new Date(Date.parse(decodedToken.expireDate)) > today && !await HashHelper.compare(body.user_agent, decodedToken.deviceId)))
            return generateResponse<{}>({}, "Invalid token", "", 400);

          this.cacheService.removeCacheItem(body.id);
          let token = jwtHandler.signNewToken({
            id: body.id,
            deviceId: await HashHelper.encrypt(body.user_agent),
            role: user.roleId,
            expireDate: new Date(new Date().setDate(today.getDate() + 7))
          }, '7d');
          this.cacheService.setCacheItem(body.id, { token });
          this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile,
            `[${user._id as unknown as string} killed his other session and logged into the system from different device]`)

          return generateResponse<{ id: string, token: string, expireDate: Date }>({
            id: user._id.toString(),
            token: token, expireDate: (new Date(new Date().setDate(today.getDay() + 7)))
          }, "Loggin in...", "HOME_PAGE", 200);
        }
      }
      catch (error) {
        return generateResponse<{}>({}, "Invalid token", "", 400);
      }
    }
  }
  resetPassword = async (body: userRequestTypes["RESET_PASSWORD"]): Promise<IResponse<{}>> => {
    let user: IUserDto = await this.repositoryService.userRepository.getById(body.id)
    if (!user) return generateResponse<{}>({}, "Invalid user operation", "LOGIN_REQURED", 404);
    if (!(await HashHelper.compare(body.currentPassword, user.password))) return generateResponse<{}>({}, "Your old password is incorrect.", "TRY_AGAIN", 400);
    if (await HashHelper.compare(body.newPassword, user.password)) return generateResponse<{}>({}, "The new password cannot be the same as the old password.", "", 400);

    user.password = await HashHelper.encrypt(body.newPassword);
    await this.repositoryService.userRepository.update(user._id as unknown as string, user);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${user._id as unknown as string} has change password.]`)
    this.cacheService.removeCacheItem(user._id as unknown as string);
    return generateResponse<{}>({}, "Your password has been changed.", "LOGIN_REQUIRED", 200);
  }

  logOut = async (body: userRequestTypes["LOGOUT"]) => {
    let decodedToken: any = jwtHandler.verifyToken(body.token.split(' ')[1])

    if (decodedToken) {
      let user = await this.repositoryService.userRepository.getById(decodedToken.id);
      if (user && await this.cacheService.getCacheItem(decodedToken.id)) {
        this.cacheService.removeCacheItem(decodedToken.id);
        this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${user._id as unknown as string} has left from the system.]`)
        return generateResponse<{}>({}, "", "", 200);
      }
    }
    else {
      return generateResponse<{}>({}, "Already Logged out.", "", 400);
    }
  }

  freezeAccount = async (body: userRequestTypes["FREEZE_ACCOUNT"]): Promise<IResponse<{}>> => {
    let user = await this.repositoryService.userRepository.getById(body.user);
    if (!user) return generateResponse<{}>({}, "Invalid User", "", 404);
    if (!await HashHelper.compare(body.password, user.password)) return generateResponse<{}>({}, "The password you entered is incorrect", "", 400);
    if (user.frozenAccount && user.frozenAccount === true) return generateResponse<{}>({}, "This account already frozen.", "", 400);
    user.frozenAccount = true;
    user.frozenAccountCode = CodeGenerator.generateVerificationCode(6);
    await this.repositoryService.userRepository.update(user._id.toString(), user);
    const cacheItem = await this.cacheService.getCacheItem(user._id.toString())
    if (cacheItem) {
      this.cacheService.removeCacheItem(user._id.toString())
    }
    this.loggerService.Log(LogType.INFO, LogLocation.all,
      `[${user._id.toString()}] has frozen his/her account`);
    return generateResponse<{}>({}, "Your account has been successfully frozen", "", 200);
  }

  reactivateAccountLink = async (body: userRequestTypes["REACTIVATE_ACCOUNT"]): Promise<IResponse<{}>> => {
    let user = await this.repositoryService.userRepository.getById(body.user);
    if (!user) return generateResponse<{}>({}, "Invalid User", "", 404);
    if (user.frozenAccount && user.frozenAccount === false) return generateResponse<{}>({}, "Your account is already active", "REACTIVATE_ACCOUNT", 400);
    const code = user.frozenAccountCode;
    await LinkHelper.SendActivationLink(user.email, user._id.toString(), code);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `Reactivation Email Has been sent to [${user._id.toString()}]`);
    return generateResponse<{}>({}, "The reactivation email has been sent to your account", "", 200);
  }
  reactivateAccountConfirm = async (body: userRequestTypes["REACTIVATE_ACCOUNT_CONFIRM"]): Promise<IResponse<{}>> => {
    let user = await this.repositoryService.userRepository.getById(body.user);
    if (!user) return generateResponse<{}>({}, "Invalid User", "", 404);
    if (user.frozenAccount && user.frozenAccount === false) return generateResponse<{}>({}, "Your account already activated.", "", 400);
    if (user.frozenAccount && user.frozenAccount === true) {
      let match = user.frozenAccountCode === body.code;
      if (match) {
        console.log("matched");
        user.frozenAccount = false;
        user.frozenAccountCode = "";
        await this.repositoryService.userRepository.update(user._id.toString(), user);
        this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${user._id.toString()}] has been activated his/her account`);
        return generateResponse<{}>({}, "Your account has been activated", "", 200);
      }
    }
  }

  deleteAccount = async (body: userRequestTypes["DELETE_ACCOUNT"]): Promise<IResponse<{}>> => {
    let user = await this.repositoryService.userRepository.getById(body.user);
    if (!user) return generateResponse<{}>({}, "Invalid User", "", 404);
    if (!await HashHelper.compare(body.password, user.password)) return generateResponse<{}>({}, "The password you entered is incorrect", "", 400);
    const cacheItem = await this.cacheService.getCacheItem(user._id.toString());
    if (cacheItem) {
      this.cacheService.removeCacheItem(user._id.toString())
    }
    await this.repositoryService.automationSettingsRepo.deleteMany({ userId: user });
    await this.repositoryService.creditRepository.deleteMany({ userId: user });
    await this.repositoryService.customerGroupRepository.deleteMany({ userId: user });
    await this.repositoryService.extraPhoneRepo.deleteMany({ userId: user });
    await this.repositoryService.quequeRepository.deleteMany({ userId: user });
    await this.repositoryService.userRepository.delete(user._id.toString());
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${user._id.toString()}] has been deleted his/her account`);
    return generateResponse<{}>({}, "", "", 200);
  }
}
