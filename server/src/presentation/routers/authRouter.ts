import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "../../application/controllers/authController";
import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { ValidationBuilder } from "../../infrastructure/services/validationBuilder";
import { baseHeader, baseHeaderWithToken, baseHeaderWithDeviceId } from "../../infrastructure/validations/headerValidations";
import {
  forgotPasswordConfirmBody,
  forgotPasswordParam,
  forgotPasswordLinkBody,
  forgotPasswordLinkParam,
  loginBody,
  resetPasswordBody,
  resetSessionBod,
  signUpBody,
  updateProfileBody,
  updateProfileParam,
  verifyEmailQuery,
  freezeAccountParam,
  reactivteAccountParam,
  deleteAccountParam,
  reactivateAccountConfirmParam,
  freezeAccountBody, deleteAccountBody
} from "../../infrastructure/validations/userValidations";
import { Middleware } from "../../application/middlewares";
@injectable()
export class AuthRouter {
  private routeProvider: Router;
  private userController: AuthController;
  private middleware: Middleware
  private validationBuilder: ValidationBuilder;
  private validations: Record<string, (req: Request, res: Response, next: NextFunction) => void> = {};
  constructor(
    @inject(Types.UserController) controller: AuthController,
    @inject(Types.ValidationBuilder) validationBuilder: ValidationBuilder,
    @inject(Types.Middleware) middleware: Middleware
  ) {
    this.routeProvider = Router();
    this.userController = controller;
    this.validationBuilder = validationBuilder;
    this.middleware = middleware;

    this.validations['signUp'] = this.validationBuilder.build(baseHeader, signUpBody, undefined, undefined);
    this.validations['verifyEmail'] = this.validationBuilder.build(baseHeader, undefined, undefined, undefined);
    this.validations['login'] = this.validationBuilder.build(baseHeader, loginBody, undefined, undefined)
    this.validations['resetPassword'] = this.validationBuilder.build(baseHeaderWithToken, resetPasswordBody, undefined, undefined)
    this.validations['forgot-password'] = this.validationBuilder.build(baseHeader, forgotPasswordLinkBody, undefined, undefined)
    this.validations['forgot-password-confirm'] = this.validationBuilder.build(baseHeader, forgotPasswordConfirmBody, undefined, forgotPasswordParam)
    this.validations['reset-session-login'] = this.validationBuilder.build(baseHeader, resetSessionBod, undefined, undefined)
    this.validations['logout'] = this.validationBuilder.build(baseHeaderWithToken, undefined, undefined, undefined);
    this.validations['freezeAccount'] = this.validationBuilder.build(baseHeaderWithToken, freezeAccountBody, undefined, freezeAccountParam);
    this.validations['reactivateAccount'] = this.validationBuilder.build(baseHeader, undefined, undefined, reactivteAccountParam);
    this.validations['reactivateAccountConfirm'] = this.validationBuilder.build(baseHeader, undefined, undefined, reactivateAccountConfirmParam);
    this.validations['deleteAccount'] = this.validationBuilder.build(baseHeaderWithToken, deleteAccountBody, undefined, deleteAccountParam);
  }
  matchControllerToRouter = () => {
    this.routeProvider.post("/api/v1/auth/sign-up/", this.validations['signUp']
      , this.userController.SignUp);
    // verify-email (need device id)
    this.routeProvider.get("/api/v1/auth/:id/verify-email",
      this.validations['verifyEmail'], this.userController.VerifyEmail);
    // login (need deviceId)
    this.routeProvider.post("/api/v1/auth/login/",
      this.validations['login'], // validation middleware, 
      this.userController.Login);

    this.routeProvider.post("/api/v1/auth/logout/",
      this.validations['logout'],
      this.middleware.verifySession,
      this.userController.Logout);
    this.routeProvider.post("/api/v1/auth/login/reset-session",
      this.validations['reset-session-login'],
      this.userController.ResetSessionAndLogin)
    // reset password (need token | need device Id)
    this.routeProvider.patch("/api/v1/auth/reset-password/",
      this.validations['resetPassword'],
      this.middleware.verifySession,
      this.userController.ResetPassword);

    // forgot password get link (need deviceId | no need token)
    this.routeProvider.post("/api/v1/auth/forgot-password/",
      this.validations['forgot-password']
      , this.userController.ForgotPasswordLink);

    // forgotPasswordConfirm (need deviceId | no need token)
    this.routeProvider.patch("/api/v1/auth/forgot-password-confirm/:token",
      this.validations['forgot-password-confirm']
      , this.userController.ForgotPasswordConfirm);

    this.routeProvider.post("/api/v1/auth/:user/account/freeze-account",
      this.validations['freezeAccount'],
      this.middleware.isFrozenAccount, this.middleware.verifySession,
      this.userController.FreezeAccount
    );

    this.routeProvider.post("/api/v1/auth/:user/account/reactivate-account",
      this.validations['reactivateAccount'],
      this.userController.ReactivateAccount
    );

    this.routeProvider.post("/api/v1/auth/:user/account/reactivate-account-confirm/:code",
      this.validations['reactivateAccountConfirm'],
      this.userController.ReactivateAccountConfirm);

    this.routeProvider.post("/api/v1/auth/:user/account/delete-account",
      this.validations['deleteAccount'],
      this.middleware.isFrozenAccount, this.middleware.verifySession,
      this.userController.DeleteAccount
    )
  }
  getRouterProvider = (): Router => {
    return this.routeProvider;
  }
}
