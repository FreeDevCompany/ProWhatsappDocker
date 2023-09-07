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
const userRepository_class_1 = require("../../infrastructure/repositories/userRepository.class");
const loggerService_class_1 = require("../../infrastructure/services/loggerService.class");
const jwtHandler_class_1 = require("../../infrastructure/services/jwtHandler.class");
const responseHelper_1 = require("../utilities/responseHelper");
let ProfileUseCases = class ProfileUseCases {
    constructor(_userRepository, _loggerService) {
        this.response = undefined;
        this.getUserDetails = (token) => __awaiter(this, void 0, void 0, function* () {
            let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(token);
            if (decodedToken && decodedToken.id) {
                let user = yield this.userRepository.getById(decodedToken.id);
                if (user) {
                    let user_data = {
                        id: user._id,
                        avatar: user.avatar,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        email: user.email,
                        role: user.roleId,
                        verified: user.verified,
                        extraNumbers: []
                    };
                    this.response = (0, responseHelper_1.generateResponse)(user_data, "Success", "", 200);
                }
                else
                    this.response = (0, responseHelper_1.generateResponse)({}, "Invalid user.", "", 404);
            }
            return this.response;
        });
        this.userRepository = _userRepository;
        this.loggerService = _loggerService;
    }
};
exports.ProfileUseCases = ProfileUseCases;
exports.ProfileUseCases = ProfileUseCases = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.IRepository)),
    __param(1, (0, inversify_1.inject)(ioc_types_1.Types.LoggerService)),
    __metadata("design:paramtypes", [userRepository_class_1.UserRepository,
        loggerService_class_1.LoggerService])
], ProfileUseCases);
//# sourceMappingURL=profileUseCases.js.map