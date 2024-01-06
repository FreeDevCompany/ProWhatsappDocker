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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const inversify_1 = require("inversify");
const profileUseCases_1 = require("../useCases/profileUseCases");
const ioc_types_1 = require("../../domain/models/ioc.types");
const errorHandler_1 = require("../utilities/errorHandler");
let ProfileController = class ProfileController {
    constructor(_service) {
        this.getUserDetails = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            let token = req.headers['x-token'];
            let response = yield this.profileUseCaseService.getUserDetails({
                token: (token && token.split(' ')[1])
            });
            return res.status(response.status_code).json(response);
        }));
        this.updateUserDetails = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            let id = req.params.user;
            let response = yield this.profileUseCaseService.updateUserDetails(id, req.body);
            return res.status(response.status_code).json(response);
        }));
        this.getActiveSessions = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            let id = req.params.user;
            let { perpage, page } = req.query;
            let response = yield this.profileUseCaseService.getActiveSessions({ id: id, page: page, perpage: perpage });
            return res.status(response.status_code).json(response);
        }));
        this.getAutomationSettings = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            let id = req.params.user;
            let response = yield this.profileUseCaseService.getAutomationSettings({ id });
            return res.status(response.status_code).json(response);
        }));
        this.updateAutomationSettings = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            let id = req.params.user;
            let body = req.body;
            let response = yield this.profileUseCaseService.updateAutomationSettings(id, body);
            return res.status(response.status_code).json(response);
        }));
        this.deleteSession = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            let { user } = req.params;
            let { session, password } = req.body;
            const response = yield this.profileUseCaseService.deleteSession({ user: user, session: session, password: password });
            return res.status(response.status_code).json(response);
        }));
        this.profileUseCaseService = _service;
    }
};
exports.ProfileController = ProfileController;
exports.ProfileController = ProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.profileUseCases)),
    __metadata("design:paramtypes", [profileUseCases_1.ProfileUseCases])
], ProfileController);
//# sourceMappingURL=profileController.js.map