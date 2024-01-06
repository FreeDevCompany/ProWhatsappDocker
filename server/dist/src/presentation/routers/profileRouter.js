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
exports.ProfileRouter = void 0;
const express_1 = require("express");
const inversify_1 = require("inversify");
const profileController_1 = require("../../application/controllers/profileController");
const middlewares_1 = require("../../application/middlewares");
const validationBuilder_1 = require("../../infrastructure/services/validationBuilder");
const ioc_types_1 = require("../../domain/models/ioc.types");
const headerValidations_1 = require("../../infrastructure/validations/headerValidations");
const userValidations_1 = require("../../infrastructure/validations/userValidations");
let ProfileRouter = class ProfileRouter {
    constructor(controller, validationBuilder, middleware) {
        this.validations = {};
        this.matchControllerToRouter = () => {
            this.routeProvider.get("/api/v1/profile/details/", this.validations['userDetails'], this.middleware.verifySession, this.profileController.getUserDetails);
            this.routeProvider.patch("/api/v1/:user/profile/details/update/", this.validations['updateUserDetails'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.profileController.updateUserDetails);
            this.routeProvider.get("/api/v1/:user/profile/automation-settings/", this.validations['getAutomationSettings'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.profileController.getAutomationSettings);
            this.routeProvider.patch("/api/v1/:user/profile/automation-settings/update/", this.validations['updateAutomaionSettings'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.profileController.updateAutomationSettings);
            this.routeProvider.get("/api/v1/:user/profile/active-session", this.validations['activeSessions'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.profileController.getActiveSessions);
            this.routeProvider.post("/api/v1/:user/profile/active-sessions/delete", this.validations['delete-session'], this.middleware.isFrozenAccount, this.middleware.verifySession, this.profileController.deleteSession);
        };
        this.getRouterProvider = () => {
            return this.routeProvider;
        };
        this.routeProvider = (0, express_1.Router)();
        this.profileController = controller;
        this.validationBuilder = validationBuilder;
        this.middleware = middleware;
        this.validations['userDetails'] = this.validationBuilder.build(headerValidations_1.baseHeaderWithToken, undefined, undefined, undefined);
        this.validations['updateUserDetails'] = this.validationBuilder.build(headerValidations_1.baseHeaderWithToken, userValidations_1.updateProfileBody, undefined, userValidations_1.updateProfileParam);
        this.validations['getAutomationSettings'] = this.validationBuilder.build(headerValidations_1.baseHeaderWithToken, undefined, undefined, userValidations_1.getAutomationSettingsParam);
        this.validations['updateAutomaionSettings'] = this.validationBuilder.build(headerValidations_1.baseHeaderWithToken, userValidations_1.updateAutomationSettings, undefined, userValidations_1.getAutomationSettingsParam);
        this.validations['activeSessions'] = this.validationBuilder.build(headerValidations_1.baseHeaderWithToken, undefined, userValidations_1.activeSessionsQuery, userValidations_1.activeSessionsParam);
        this.validations['delete-session'] = this.validationBuilder.build(headerValidations_1.baseHeaderWithToken, userValidations_1.deleteSessionBody, undefined, userValidations_1.deleteSessionParam);
    }
};
exports.ProfileRouter = ProfileRouter;
exports.ProfileRouter = ProfileRouter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.profileController)),
    __param(1, (0, inversify_1.inject)(ioc_types_1.Types.ValidationBuilder)),
    __param(2, (0, inversify_1.inject)(ioc_types_1.Types.Middleware)),
    __metadata("design:paramtypes", [profileController_1.ProfileController,
        validationBuilder_1.ValidationBuilder,
        middlewares_1.Middleware])
], ProfileRouter);
//# sourceMappingURL=profileRouter.js.map