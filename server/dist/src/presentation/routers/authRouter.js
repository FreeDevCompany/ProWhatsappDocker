"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../../application/controllers/authController");
const inversify_1 = require("inversify");
const ioc_types_1 = require("../../domain/models/ioc.types");
const validationBuilder_1 = require("../../infrastructure/services/validationBuilder");
const headerValidations_1 = require("../../infrastructure/validations/headerValidations");
const userValidations_1 = require("../../infrastructure/validations/userValidations");
const middlewares_1 = require("../../application/middlewares");
let AuthRouter = class AuthRouter {
    constructor(controller, validationBuilder, middleware) {
        this.validations = {};
        this.matchControllerToRouter = () => {
            this.routeProvider.post("/api/v1/auth/sign-up/", this.validations['signUp'], this.userController.SignUp);
            // verify-email (need device id)
            this.routeProvider.get("/api/v1/auth/:id/verify-email", this.validations['verifyEmail'], this.userController.VerifyEmail);
            // login (need deviceId)
            this.routeProvider.post("/api/v1/auth/login/", this.validations['login'], // validation middleware, 
            this.userController.Login);
            this.routeProvider.post("/api/v1/auth/login/reset-session", this.validations['reset-session-login'], this.userController.ResetSessionAndLogin);
            // reset password (need token | need device Id)
            this.routeProvider.patch("/api/v1/auth/reset-password/", this.validations['resetPassword'], this.middleware.verifySession, this.userController.ResetPassword);
            // forgot password get link (need deviceId | no need token)
            this.routeProvider.post("/api/v1/auth/forgot-password/", this.validations['forgot-password'], this.userController.ForgotPasswordLink);
            // forgotPasswordConfirm (need deviceId | no need token)
            this.routeProvider.patch("/api/v1/auth/forgot-password-confirm/:token", this.validations['forgot-password-confirm'], this.userController.ForgotPasswordConfirm);
        };
        this.getRouterProvider = () => {
            return this.routeProvider;
        };
        this.routeProvider = (0, express_1.Router)();
        this.userController = controller;
        this.validationBuilder = validationBuilder;
        this.middleware = middleware;
        this.validations['signUp'] = this.validationBuilder.build(headerValidations_1.baseHeader, userValidations_1.signUpBody, undefined, undefined);
        this.validations['verifyEmail'] = this.validationBuilder.build(headerValidations_1.baseHeader, undefined, undefined, undefined);
        this.validations['login'] = this.validationBuilder.build(headerValidations_1.baseHeader, userValidations_1.loginBody, undefined, undefined);
        this.validations['resetPassword'] = this.validationBuilder.build(headerValidations_1.baseHeaderWithToken, userValidations_1.resetPasswordBody, undefined, undefined);
        this.validations['forgot-password'] = this.validationBuilder.build(headerValidations_1.baseHeader, userValidations_1.forgotPasswordLinkBody, undefined, undefined);
        this.validations['forgot-password-confirm'] = this.validationBuilder.build(headerValidations_1.baseHeader, userValidations_1.forgotPasswordConfirmBody, undefined, userValidations_1.forgotPasswordConfirmQuery);
        this.validations['reset-session-login'] = this.validationBuilder.build(headerValidations_1.baseHeader, userValidations_1.resetSessionBod, undefined, undefined);
    }
};
exports.AuthRouter = AuthRouter;
exports.AuthRouter = AuthRouter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.UserController)),
    __param(1, (0, inversify_1.inject)(ioc_types_1.Types.ValidationBuilder)),
    __param(2, (0, inversify_1.inject)(ioc_types_1.Types.Middleware)),
    __metadata("design:paramtypes", [authController_1.AuthController,
        validationBuilder_1.ValidationBuilder,
        middlewares_1.Middleware])
], AuthRouter);
//# sourceMappingURL=authRouter.js.map