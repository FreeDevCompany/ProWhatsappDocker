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
exports.ProfileUseCases = void 0;
const inversify_1 = require("inversify");
const ioc_types_1 = require("../../domain/models/ioc.types");
const loggerService_class_1 = require("../../infrastructure/services/loggerService.class");
const jwtHandler_class_1 = require("../../infrastructure/services/jwtHandler.class");
const responseHelper_1 = require("../utilities/responseHelper");
const repositoryService_class_1 = require("../../infrastructure/services/repositoryService.class");
const mongoose_1 = require("mongoose");
const wpSession_types_1 = require("../../domain/models/wpSession.types");
const linkHelper_1 = require("../utilities/linkHelper");
const hashHelper_1 = require("../utilities/hashHelper");
let ProfileUseCases = class ProfileUseCases {
    constructor(repositoryService, _loggerService) {
        this.getUserDetails = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(body.token);
                if (decodedToken && decodedToken.id) {
                    let user = yield this.repositoryService.userRepository.getAllDataWithPopulate('roleId', 'Role', decodedToken.id, undefined);
                    if (!user)
                        return (0, responseHelper_1.generateResponse)({}, "Invalid user.", "", 404);
                    let user_data = {
                        id: user._id,
                        avatar: user.avatar,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        email: user.email,
                        role: user.roleId.toJSON()['roleName'],
                        verified: user.verified,
                        credits: (yield this.repositoryService.creditRepository.findOne({
                            userId: user._id,
                        })).totalAmount
                    };
                    return (0, responseHelper_1.generateResponse)(user_data, "Success", "", 200);
                }
            }
            catch (err) {
                return (0, responseHelper_1.generateResponse)({}, err.message, "", 500);
            }
        });
        this.updateUserDetails = (userId, body) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repositoryService.userRepository.getById(userId);
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid user.", "", 404);
            user.avatar = body.avatar;
            user.firstName = body.firstName;
            user.lastName = body.lastName;
            yield this.repositoryService.userRepository.update(userId, user);
            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${userId}] has been updated profile details`);
            return (0, responseHelper_1.generateResponse)({}, "Profile has been successfully updated.", "GET_PROFILE", 200);
        });
        this.getAutomationSettings = (body) => __awaiter(this, void 0, void 0, function* () {
            let autoSettings = yield this.repositoryService.automationSettingsRepo.findOne({ userId: new mongoose_1.Types.ObjectId(body.id) });
            if (!autoSettings)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User", "", 400);
            let data = {
                beginTime: autoSettings.beginTime,
                min_message_delay: autoSettings.min_message_delay,
                max_message_delay: autoSettings.max_message_delay,
                updatedAt: autoSettings.updatedAt
            };
            return (0, responseHelper_1.generateResponse)(data, "Success", "", 200);
        });
        this.getActiveSessions = (body) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repositoryService.userRepository.getById(body.id);
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User", "", 400);
            const sessionId = (user._id + ":" + user.phone);
            const session = yield wpSession_types_1.wpSessionCollection.findOne({ _id: sessionId });
            let returnObject = [];
            if (session) {
                returnObject.push({
                    sessionName: session._id,
                    phone: session._id.split(':')[1]
                });
            }
            let response = {
                data: returnObject,
                requirement: "",
                status_code: 200,
                message: "Success",
                meta: {
                    page: body.page,
                    perpage: body.perpage,
                    totalItems: 1 * body.perpage,
                    totalPages: 1,
                    links: linkHelper_1.LinkHelper.GeneratePaginateLink(body.id, 'profile/active-session', 1, body.page, body.perpage)
                }
            };
            return response;
        });
        this.updateAutomationSettings = (id, body) => __awaiter(this, void 0, void 0, function* () {
            let autoSettings = yield this.repositoryService.automationSettingsRepo.findOne({ userId: new mongoose_1.Types.ObjectId(id) });
            if (!autoSettings)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User", "", 400);
            autoSettings.beginTime = body.beginTime;
            autoSettings.min_message_delay = body.min_message_delay;
            autoSettings.max_message_delay = body.max_message_delay;
            yield this.repositoryService.automationSettingsRepo.update(autoSettings._id, autoSettings);
            return (0, responseHelper_1.generateResponse)({}, "Automation settings has been successfully updated.", "GET_AUTOMATION_SETTINGS", 200);
        });
        this.deleteSession = (body) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repositoryService.userRepository.getById(body.user);
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User", "", 400);
            if (!(yield hashHelper_1.HashHelper.compare(body.password, user.password))) {
                return (0, responseHelper_1.generateResponse)({}, "Wrong Password", "", 400);
            }
            const session = yield wpSession_types_1.wpSessionCollection.findOne({ _id: body.session });
            if (!session) {
                this.loggerService.Log(loggerService_class_1.LogType.WARNING, loggerService_class_1.LogLocation.all, `[${body.user}] is trying to delete session which not own`);
                return (0, responseHelper_1.generateResponse)({}, "The session could not be found.", "", 404);
            }
            yield wpSession_types_1.wpSessionCollection.deleteOne({ _id: body.session });
            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.all, `[${body.user}] has been delete a wp-session => [${body.session}]`);
            return (0, responseHelper_1.generateResponse)({}, "The Session has been deleted.", "", 200);
        });
        this.repositoryService = repositoryService;
        this.loggerService = _loggerService;
    }
};
exports.ProfileUseCases = ProfileUseCases;
exports.ProfileUseCases = ProfileUseCases = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("RepositoryService")),
    __param(1, (0, inversify_1.inject)(ioc_types_1.Types.LoggerService)),
    __metadata("design:paramtypes", [repositoryService_class_1.RepositoryService,
        loggerService_class_1.LoggerService])
], ProfileUseCases);
//# sourceMappingURL=profileUseCases.js.map