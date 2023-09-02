import { inject, injectable } from "inversify"
import { Types } from "../../domain/models/ioc.types"
import { UserRepository } from "../../infrastructure/repositories/userRepository.class"
import { userRequestTypes } from "../../domain/http/Requests.types/user";
import { IResponse } from "../../domain/http/baseResponse.types";
import { IUserDto } from "../../domain/models/user.types";
import { GmailSender } from "../../infrastructure/services/mailProvider.class";
import { HashHelper } from "../utilities/hashHelper";
import { SessionHelper } from "../utilities/sessionHelper";
import { LogLocation, LogType, LoggerService } from "../../infrastructure/services/loggerService.class";


@injectable()
export class AuthenticationUseCases {

    private userRepository: UserRepository;
    private loggerService: LoggerService;
    private mailService: GmailSender;
    constructor(@inject(Types.IRepository) _userRepository: UserRepository, @inject(Types.LoggerService) _loggerService: LoggerService) {
        this.userRepository = _userRepository;
        this.mailService = GmailSender.getInstance();
        this.mailService.createLocalConnection();
        this.loggerService = _loggerService;
    }
    createUser = async (body: userRequestTypes['signUp']): Promise<IResponse<{} | IResponse<IUserDto>>> => {
        try {
            let foundUser = await this.userRepository.findOne({ email: body.email, phone: body.phone });
            if (foundUser) {

                //this.userRepository.delete(foundUser._id as unknown as string);
                this.loggerService.Log(LogType.WARNING, LogLocation.consoleAndFile, "The client is trying to register again with the information registered in the system.");
                return {
                    data: {},
                    message: "There is a user registered in the system with this credentials.",
                    status_code: 400,
                    requirement: "TRY_AGAIN"
                }
                // used credentialsMessage
            }
            let newUser: IUserDto = {
                avatar: body.avatar as Buffer,
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phone,
                email: body.email,
                password: body.password,
                extraNumberCount: 0,
                roleId: "asdasda",
            }
            let savedUser = await this.userRepository.create(newUser);
            await this.mailService.sendMail({
                provider: "test@gmail.com",
                from: "Pro-Whats-App-WEB Service",
                subject: "Email verification",
                text: "",
                to: savedUser.email
            });
            this.loggerService.Log(LogType.INFO, LogLocation.all,`The email has been sent. A new user has joined us. ${savedUser.firstName}`);
            return {
                data: savedUser,
                message: "Successfully Registered. Email Has been sent for verfication. ",
                requirement: "GOTO_HOME_PAGE",
                status_code: 200
            }
        }
        catch (error) {
            this.loggerService.Log(LogType.ERROR, LogLocation.consoleAndFile, error.message);
            // internal server Error handling (throw | response)
            return {
                data: {},
                message: error.message,
                requirement: "",
                status_code: 500
            }
        }
    }


    getForgotPasswordLink = async (email: string): Promise<IResponse<{}>> => {
        let user: IUserDto = await this.userRepository.findOne({ email: email })
        if (user) {
            let link = `http://localhost:5000/api/v1/auth/forgot-password-confirm/${user._id}}/`;
            await this.mailService.sendMail({
                provider: "test@gmail.com",
                from: "Pro-Whats-App-WEB Service",
                subject: "Email verification",
                text: "",
                to: user.email
            });
            return {
                data: {
                    link: link
                },
                message: "The email has been sent to your account",
                requirement: "CONFIRM_FORGOT_PASSWORD",
                status_code: 200
            }
        }
        return {
            data: {},
            requirement: "",
            message: "There is no registered user with this email.",
            status_code: 400
        }
    }

    getForgotPasswordConfirm = async (userId: string, password: string): Promise<IResponse<{}>> => {
        let user = await this.userRepository.getById(userId);
        if (user) {
            if (HashHelper.compare(password, user.password)) {
                return {
                    data: {},
                    message: "The new password cannot be the same as the old password.",
                    requirement: "",
                    status_code: 400
                }
            }
            else {
                user.password = await HashHelper.encrypt(password);
                await this.userRepository.update(user._id as unknown as string, user);
                return {
                    data: {
                        user: user
                    },
                    message: "The password has been successfully changed.",
                    requirement: "LOGIN_REQUIRED",
                    status_code: 200
                }
            }

        }
        return {
            data: {},
            requirement: "",
            message: "There is no registered user with this email.",
            status_code: 400
        }
    }
    
    verifyEmail = async (userId: string): Promise<IResponse<{}>> => {
        try {
            let user = await this.userRepository.getById(userId);
            if (!user.verified) {
                user.email_hash = await HashHelper.encrypt(user.email);
                user.verified = true;
                await this.userRepository.update(user._id as unknown as string, user);
                return {
                    data: {},
                    message: "Email verified Successfully.",
                    requirement: "LOGIN_REQUIRED",
                    status_code: 200,
                }
            }
            return {
                data: {},
                message: "Email Already verified.",
                requirement: "LOGIN_REQUIRED",
                status_code: 400,
            }
        }
        catch (error) {
            return {
                data: {},
                message: error.message,
                requirement: "",
                status_code: 400
            }
        }
    }

    Login = async (deviceId: string, email: string, password: string): Promise<IResponse<{}>> => {
        let user = await this.userRepository.findOne({ email: email });
        if (user) {
            if (!HashHelper.compare(password, user.password)) {
                return {
                    data: {},
                    message: "The password you entered is incorrect",
                    requirement: "HOME_PAGE",
                    status_code: 200,
                }
            }
            if (user.verified === false) {
                return {
                    data: {},
                    message: "You need to verify your e-mail.",
                    requirement: "VERIFY_EMAIL",
                    status_code: 401
                }
            }
            let token_info = await SessionHelper.generateSessionToken(user._id as
                unknown as string,
                deviceId);
            if (!user.activeSession) {
                user.activeSession = token_info;
                await this.userRepository.update(user._id as unknown as string, user);
                return {
                    data: { token_info },
                    message: "Logging in...",
                    requirement: "HOME_PAGE",
                    status_code: 200,
                }
            }
            else {
                let checkString = user._id as unknown as string + deviceId;
                if(HashHelper.compare(checkString,user.activeSession.token))
                return {
                    data: {},
                    message: "You have an open session on another device. Do you want to log out?",
                    requirement: "HOME_PAGE",
                    status_code: 202,
                }
            }
        }
        return {
            data: {},
            message: "Invalid email",
            requirement: "TRY_AGAIN",
            status_code: 200,
        }
    }

    resetPassword = async (id: string, currentPassword: string, newPassword: string): Promise<IResponse<{}>> => {
        let user: IUserDto = await this.userRepository.getById(id);
        if (user) {
            if (!HashHelper.compare(currentPassword, user.password)) {
                return {
                    data: {},
                    message: "Your old password is wrong.",
                    requirement: "TRY_AGAIN",
                    status_code: 400,
                }
            }
            if (HashHelper.compare(newPassword, user.password)) {
                return {
                    data: {},
                    message: "The new password cannot be the same as the old password.",
                    requirement: "",
                    status_code: 400
                }
            }
            user.password = await HashHelper.encrypt(newPassword);
            this.userRepository.update(user._id as unknown as string, user);
            return {
                data: {},
                message: "Your password has been changed.",
                requirement: "LOGIN_REQUIRED",
                status_code: 200,
            }
        }
        else {
            return {
                data: {},
                message: "Invalid user operation",
                requirement: "LOGIN_REQUIRED",
                status_code: 500
            }
        }

    }
}