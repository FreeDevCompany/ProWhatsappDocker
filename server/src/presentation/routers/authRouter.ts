import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "../../application/controllers/authController";
import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { ValidationBuilder } from "../../infrastructure/services/validationBuilder";
import { baseHeader, baseHeaderWithToken, baseHeaderWithDeviceId } from "../../infrastructure/validations/headerValidations";
import { forgotPasswordConfirmBody, forgotPasswordLinkBody, forgotPasswordLinkParam, loginBody, resetPasswordBody, signUpBody, updateProfileBody, updateProfileParam, verifyEmailParams } from "../../infrastructure/validations/userValidations";
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
        this.validations['verifyEmail'] = this.validationBuilder.build(baseHeader, undefined, undefined, verifyEmailParams);
        this.validations['login'] = this.validationBuilder.build(baseHeaderWithDeviceId, loginBody, undefined, undefined)
        this.validations['resetPassword'] = this.validationBuilder.build(baseHeaderWithToken, resetPasswordBody, undefined, undefined)
        this.validations['forgot-password'] = this.validationBuilder.build(baseHeader, forgotPasswordLinkBody, undefined, undefined)
        this.validations['forgot-password-confirm'] = this.validationBuilder.build(baseHeader, forgotPasswordConfirmBody, undefined, forgotPasswordLinkParam)
    }
    matchControllerToRouter = () => {
        this.routeProvider.post("/api/v1/auth/sign-up/", this.validations['signUp']
            , this.userController.SignUp);
        // verify-email (need device id)
        this.routeProvider.get("/api/v1/auth/verify-email/:userId/:deviceId",
        this.validations['verifyEmail'],this.userController.VerifyEmail);
        // login (need deviceId)
        this.routeProvider.post("/api/v1/auth/login/",
            this.validations['login'], // validation middleware, 
            this.userController.Login);

        // reset password (need token | need device Id)
        this.routeProvider.patch("/api/v1/auth/reset-password/",
            this.validations['resetPassword'],
            this.middleware.verifySession,
            this.userController.ResetPassword);

        // forgot password get link (need deviceId | no need token)
        this.routeProvider.get("/api/v1/auth/forgot-password/",
            this.validations['forgot-password']
            , this.userController.ForgotPasswordLink);

        // forgotPasswordConfirm (need deviceId | no need token)
        this.routeProvider.patch("/api/v1/auth/forgot-password-confirm/:userId/",
            this.validations['forgot-password-confirm']
            , this.userController.ForgotPasswordConfirm);

    }
    getRouterProvider = (): Router => {
        return this.routeProvider;
    }
}
