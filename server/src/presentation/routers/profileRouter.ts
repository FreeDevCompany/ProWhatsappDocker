import { Request, Response, NextFunction, Router } from "express";
import { inject, injectable } from "inversify";
import { ProfileController } from "../../application/controllers/profileController";
import { Middleware } from "../../application/middlewares";
import { ValidationBuilder } from "../../infrastructure/services/validationBuilder";
import { Types } from "../../domain/models/ioc.types";
import { baseHeaderWithToken } from "../../infrastructure/validations/headerValidations";
import { activeSessionsParam, activeSessionsQuery, deleteSessionBody, deleteSessionParam, getAutomationSettingsParam, updateAutomationSettings, updateProfileBody, updateProfileParam } from "../../infrastructure/validations/userValidations";


@injectable()
export class ProfileRouter {
  private routeProvider: Router;
  private profileController: ProfileController
  private middleware: Middleware
  private validationBuilder: ValidationBuilder
  private validations: Record<string, (req: Request, res: Response, next: NextFunction) => void> = {};

  constructor(
    @inject(Types.profileController) controller: ProfileController,
    @inject(Types.ValidationBuilder) validationBuilder: ValidationBuilder,
    @inject(Types.Middleware) middleware: Middleware
  ) {
    this.routeProvider = Router();
    this.profileController = controller;
    this.validationBuilder = validationBuilder;
    this.middleware = middleware;
    this.validations['userDetails'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, undefined);
    this.validations['updateUserDetails'] = this.validationBuilder.build(baseHeaderWithToken, updateProfileBody, undefined, updateProfileParam);
    this.validations['getAutomationSettings'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, getAutomationSettingsParam)
    this.validations['updateAutomaionSettings'] = this.validationBuilder.build(baseHeaderWithToken, updateAutomationSettings, undefined, getAutomationSettingsParam);
    this.validations['activeSessions'] = this.validationBuilder.build(baseHeaderWithToken, undefined, activeSessionsQuery, activeSessionsParam);
    this.validations['delete-session'] = this.validationBuilder.build(baseHeaderWithToken, deleteSessionBody, undefined, deleteSessionParam)
  }
  matchControllerToRouter = () => {
    this.routeProvider.get("/api/v1/profile/details/", this.validations['userDetails']
      , this.middleware.verifySession, this.profileController.getUserDetails);

    this.routeProvider.patch("/api/v1/:user/profile/details/update/", this.validations['updateUserDetails'],
      this.middleware.isFrozenAccount, this.middleware.verifySession, this.profileController.updateUserDetails);

    this.routeProvider.get("/api/v1/:user/profile/automation-settings/",
      this.validations['getAutomationSettings'], this.middleware.isFrozenAccount,
      this.middleware.verifySession,
      this.profileController.getAutomationSettings);

    this.routeProvider.patch("/api/v1/:user/profile/automation-settings/update/",
      this.validations['updateAutomaionSettings'],
      this.middleware.isFrozenAccount, this.middleware.verifySession,
      this.profileController.updateAutomationSettings);

    this.routeProvider.get("/api/v1/:user/profile/active-session",
      this.validations['activeSessions'],
      this.middleware.isFrozenAccount, this.middleware.verifySession,
      this.profileController.getActiveSessions
    );

    this.routeProvider.post("/api/v1/:user/profile/active-sessions/delete", this.validations['delete-session'],
      this.middleware.isFrozenAccount,
      this.middleware.verifySession,
      this.profileController.deleteSession);
  }

  getRouterProvider = () => {
    return this.routeProvider;
  }
}
