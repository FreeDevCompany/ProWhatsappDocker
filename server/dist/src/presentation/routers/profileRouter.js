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
let ProfileRouter = class ProfileRouter {
    constructor(controller, validationBuilder, middleware) {
        this.validations = {};
        this.matchControllerToRouter = () => {
            this.routeProvider.get("/api/v1/profile/details/", this.validations['userDetails'], this.middleware.verifySession, this.profileController.getUserDetails);
        };
        this.getRouterProvider = () => {
            return this.routeProvider;
        };
        this.routeProvider = (0, express_1.Router)();
        this.profileController = controller;
        this.validationBuilder = validationBuilder;
        this.middleware = middleware;
        this.validations['userDetails'] = this.validationBuilder.build(headerValidations_1.baseHeaderWithToken, undefined, undefined, undefined);
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