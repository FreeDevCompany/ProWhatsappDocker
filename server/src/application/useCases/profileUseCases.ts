import { inject, injectable, named } from "inversify"
import { Types } from "../../domain/models/ioc.types"
import { IPaginationResponse, IResponse } from "../../domain/http/baseResponse.types";
import { LogLocation, LogType, LoggerService } from "../../infrastructure/services/loggerService.class";
import { jwtHandler } from "../../infrastructure/services/jwtHandler.class";
import { generateResponse } from "../utilities/responseHelper";
import { RepositoryService } from "../../infrastructure/services/repositoryService.class";
import { profileRequestTypes } from "../../domain/http/Requests.types/profile";
import mongoose, { Types as mongoTypes } from "mongoose";
import { wpSessionCollection } from "../../domain/models/wpSession.types";
import { LinkHelper } from "../utilities/linkHelper";
import { HashHelper } from "../utilities/hashHelper";


@injectable()
export class ProfileUseCases {

  private repositoryService: RepositoryService;
  private loggerService: LoggerService;
  constructor(
    @inject("RepositoryService") repositoryService: RepositoryService,
    @inject(Types.LoggerService) _loggerService: LoggerService) {
    this.repositoryService = repositoryService;
    this.loggerService = _loggerService;
  }

  getUserDetails = async (body: profileRequestTypes["GET_USER_DETAIL"]): Promise<IResponse<{}>> => {
    try {
      let decodedToken: any = jwtHandler.verifyToken(body.token);
      if (decodedToken && decodedToken.id) {
        let user = await this.repositoryService.userRepository.getAllDataWithPopulate('roleId', 'Role', decodedToken.id, undefined);
        if (!user) return generateResponse<{}>({}, "Invalid user.", "", 404);
        let user_data = {
          id: user._id as unknown as string,
          avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          role: user.roleId.toJSON()['roleName'],
          verified: user.verified,
          credits: (await this.repositoryService.creditRepository.findOne({
            userId: user._id,
          })).totalAmount
        }
        return generateResponse<typeof user_data>(user_data, "Success", "", 200);
      }
    }
    catch (err) {
      return generateResponse<{}>({}, err.message, "", 500);
    }
  }

  updateUserDetails = async (userId: string, body: profileRequestTypes['UPDATE_DETAIL']): Promise<IResponse<{}>> => {
    let user = await this.repositoryService.userRepository.getById(userId);
    if (!user) return generateResponse<{}>({}, "Invalid user.", "", 404);
    user.avatar = body.avatar;
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    await this.repositoryService.userRepository.update(userId, user);
    this.loggerService.Log(LogType.INFO, LogLocation.consoleAndFile, `[${userId}] has been updated profile details`);
    return generateResponse<{}>({}, "Profile has been successfully updated.", "GET_PROFILE", 200);
  }

  getAutomationSettings = async (body: profileRequestTypes["GET_AUTOMATION_SETTINGS"]): Promise<IResponse<{}>> => {
    let autoSettings = await this.repositoryService.automationSettingsRepo.findOne({ userId: new mongoTypes.ObjectId(body.id) });
    if (!autoSettings) return generateResponse<{}>({}, "Invalid User", "", 400);
    let data = {
      beginTime: autoSettings.beginTime,
      min_message_delay: autoSettings.min_message_delay,
      max_message_delay: autoSettings.max_message_delay,
      updatedAt: autoSettings.updatedAt
    }
    return generateResponse<typeof data>(data, "Success", "", 200);
  }
  getActiveSessions = async (body: profileRequestTypes["GET_ACTIVE_SESSIONS"]): Promise<IPaginationResponse<{}> | IResponse<{}>> => {
    const user = await this.repositoryService.userRepository.getById(body.id);
    if (!user) return generateResponse<{}>({}, "Invalid User", "", 400);
    const sessionId = (user._id as unknown as string + ":" + user.phone) as any;
    const session = await wpSessionCollection.findOne({ _id: sessionId });

    let returnObject = [];
    if (session) {
      returnObject.push(
        {
          sessionName: session._id as unknown as string,
          phone: (session._id as unknown as string).split(':')[1]
        }
      )
    }
    let response: IPaginationResponse<{}> = {
      data: returnObject,
      requirement: "",
      status_code: 200,
      message: "Success",
      meta: {
        page: body.page,
        perpage: body.perpage,
        totalItems: 1 * body.perpage,
        totalPages: 1,
        links: LinkHelper.GeneratePaginateLink(body.id, 'profile/active-session', 1, body.page, body.perpage)
      }
    }
    return response;
  }

  updateAutomationSettings = async (id: string, body: profileRequestTypes['UPDATE_AUTOMATION_SETTINGS']): Promise<IResponse<{}>> => {
    let autoSettings = await this.repositoryService.automationSettingsRepo.findOne({ userId: new mongoTypes.ObjectId(id) });
    if (!autoSettings) return generateResponse<{}>({}, "Invalid User", "", 400);
    autoSettings.beginTime = body.beginTime;
    autoSettings.min_message_delay = body.min_message_delay;
    autoSettings.max_message_delay = body.max_message_delay;
    await this.repositoryService.automationSettingsRepo.update(autoSettings._id as unknown as string, autoSettings);
    return generateResponse<{}>({}, "Automation settings has been successfully updated.", "GET_AUTOMATION_SETTINGS", 200);
  }

  deleteSession = async (body: profileRequestTypes['DELETE_SESSION']): Promise<IResponse<{}>> => {
    const user = await this.repositoryService.userRepository.getById(body.user);
    if (!user) return generateResponse<{}>({}, "Invalid User", "", 400);
    if (!await HashHelper.compare(body.password, user.password)) {
      return generateResponse<{}>({}, "Wrong Password", "", 400);
    }
    const session = await wpSessionCollection.findOne({ _id: body.session as unknown });
    if (!session) {
      this.loggerService.Log(LogType.WARNING, LogLocation.all, `[${body.user}] is trying to delete session which not own`)
      return generateResponse<{}>({}, "The session could not be found.", "", 404);
    }
    await wpSessionCollection.deleteOne({ _id: body.session as unknown });
    this.loggerService.Log(LogType.INFO, LogLocation.all, `[${body.user}] has been delete a wp-session => [${body.session}]`);
    return generateResponse<{}>({}, "The Session has been deleted.", "", 200);
  }
}
