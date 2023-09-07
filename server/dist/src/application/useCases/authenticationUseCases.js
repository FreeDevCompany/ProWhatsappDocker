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
exports.AuthenticationUseCases = void 0;
const inversify_1 = require("inversify");
const ioc_types_1 = require("../../domain/models/ioc.types");
const userRepository_class_1 = require("../../infrastructure/repositories/userRepository.class");
const mailProvider_class_1 = require("../../infrastructure/services/mailProvider.class");
const hashHelper_1 = require("../utilities/hashHelper");
const loggerService_class_1 = require("../../infrastructure/services/loggerService.class");
const redisService_1 = require("../../infrastructure/cacheManagement/redisService");
const jwtHandler_class_1 = require("../../infrastructure/services/jwtHandler.class");
const linkHelper_1 = require("../utilities/linkHelper");
const responseHelper_1 = require("../utilities/responseHelper");
let AuthenticationUseCases = class AuthenticationUseCases {
    constructor(_userRepository, _loggerService, cacheService) {
        this.response = undefined;
        this.createUser = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.response = undefined;
                // checking email and password already used in system from database
                let foundUser = yield this.userRepository.findOne({
                    $or: [{ email: body.email }, { phone: body.phone }]
                });
                if (foundUser) {
                    this.loggerService.Log(loggerService_class_1.LogType.WARNING, loggerService_class_1.LogLocation.consoleAndFile, "The client is trying to register again with the information registered in the system.");
                    this.response = (0, responseHelper_1.generateResponse)({}, "There is a user registered in the system with this credentials.", "TRY_AGAIN", 400);
                }
                else {
                    let saved = yield this.userRepository.createUser(body.avatar, body.firstName, body.lastName, body.phone, body.email, yield hashHelper_1.HashHelper.encrypt(body.password), 0, "user");
                    yield linkHelper_1.LinkHelper.SendVerifyEmail(saved.email, saved._id);
                    // creating new user operation with the user data.
                    this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.all, `The email has been sent. A new user has joined us. ${saved._id}`);
                    this.response = (0, responseHelper_1.generateResponse)(saved, "Successfully Registered. Email Has been sent for verfication.", "GOTO_HOME_PAGE", 201);
                }
                return this.response;
            }
            catch (error) {
                this.loggerService.Log(loggerService_class_1.LogType.ERROR, loggerService_class_1.LogLocation.consoleAndFile, error.message);
                // internal server Error handling (throw | response)
                this.response = (0, responseHelper_1.generateResponse)({}, error.message, "", 500);
                return this.response;
            }
        });
        this.verifyEmail = (userId, email_hash) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.response = undefined;
                let user = yield this.userRepository.getById(userId);
                if (user) {
                    if (user.verified === false && !user.email_hash) {
                        let hashCompareVal = `${user.email}${user._id}`;
                        if (yield hashHelper_1.HashHelper.compare(hashCompareVal, email_hash)) {
                            user.verified = true;
                            user.email_hash = email_hash;
                            yield this.userRepository.update(user._id, user);
                            this.response = (0, responseHelper_1.generateResponse)({}, "Email verified Successfully.", "LOGIN_REQUEIRED", 200);
                            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id}] verified email.`);
                        }
                        else {
                            this.response = (0, responseHelper_1.generateResponse)({}, "Email verification time already verificated.", "", 200);
                        }
                    }
                    else
                        this.response = (0, responseHelper_1.generateResponse)({}, "Email verification time already verificated.", "", 200);
                }
                else
                    this.response = (0, responseHelper_1.generateResponse)({}, "Invalid User.", "", 404);
                return this.response;
            }
            catch (error) {
                this.loggerService.Log(loggerService_class_1.LogType.ERROR, loggerService_class_1.LogLocation.all, error.message);
                this.response = (0, responseHelper_1.generateResponse)({}, error.message, "", 500);
                return this.response;
            }
        });
        this.getForgotPasswordLink = (email, user_agent) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.response = undefined;
                let user = yield this.userRepository.findOne({ email: email });
                if (user) {
                    let forgotToken = jwtHandler_class_1.jwtHandler.signNewToken({
                        email: user.email,
                        id: user._id,
                    }, '5m');
                    this.cacheService.setCacheItem(`${user_agent}-forgotPass`, { token: forgotToken });
                    linkHelper_1.LinkHelper.SendForgotPasswordLink(user.email, user._id, forgotToken);
                    this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `Email has been sent to ${user._id} for forgot password operation.`);
                    this.response = (0, responseHelper_1.generateResponse)({}, "The email has been sent to your account", "CONFIRM_FORGOT_PASSWROD", 200);
                }
                else
                    this.response = (0, responseHelper_1.generateResponse)({}, "There is no registered user with this email.", "", 400);
                return this.response;
            }
            catch (error) {
                this.loggerService.Log(loggerService_class_1.LogType.ERROR, loggerService_class_1.LogLocation.all, error.message);
                this.response = (0, responseHelper_1.generateResponse)({}, error.message, "", 500);
                return this.response;
            }
        });
        this.getForgotPasswordConfirm = (token, password, user_agent) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.response = undefined;
                if (yield this.cacheService.getCacheItem(`${user_agent}-forgotPass`)) {
                    let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(token);
                    if (decodedToken && decodedToken.id && decodedToken.email) {
                        let user = yield this.userRepository.getById(decodedToken.id);
                        if ((yield hashHelper_1.HashHelper.compare(password, user.password)))
                            this.response = (0, responseHelper_1.generateResponse)({}, "The new password cannot be the same as the old password.", "", 400);
                        else {
                            user.password = yield hashHelper_1.HashHelper.encrypt(password);
                            yield this.userRepository.update(user._id, user);
                            this.cacheService.removeCacheItem(`${user_agent}-forgotPass`);
                            this.response = (0, responseHelper_1.generateResponse)({}, "The password has been successfully changed.", "LOGIN_REQUIRED", 200);
                            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `${user._id} has changed his password. [FORGOT PASSWORD]`);
                        }
                    }
                }
                else {
                    this.response = (0, responseHelper_1.generateResponse)({}, "Forgot Password time has expired", "", 404);
                }
            }
            catch (error) {
                this.response = (0, responseHelper_1.generateResponse)({}, "Forgot Password time has expired", "", 404);
            }
            return this.response;
        });
        this.Login = (user_agent, email, password) => __awaiter(this, void 0, void 0, function* () {
            this.response = undefined;
            let user = yield this.userRepository.findOne({ email: email });
            let today = new Date();
            if (user) {
                if (!(yield hashHelper_1.HashHelper.compare(password, user.password)))
                    this.response = (0, responseHelper_1.generateResponse)({}, "The password you entered is incorrect", "LOGIN_REQUIRED", 400);
                else if (user.verified === false)
                    this.response = (0, responseHelper_1.generateResponse)({}, "You need to verify your e-mail.", "VERIFY_EMAIL", 403);
                else {
                    let cachedData = yield this.cacheService.getCacheItem(user._id);
                    if (cachedData) {
                        try {
                            let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(cachedData.token);
                            if (decodedToken.expireDate && decodedToken.deviceId) {
                                if (new Date(Date.parse(decodedToken.expireDate)) > today && !(yield hashHelper_1.HashHelper.compare(user_agent, decodedToken.deviceId)))
                                    this.response = (0, responseHelper_1.generateResponse)({ id: decodedToken.id }, "You have an open session. Would you like to end your current session and continue from here?", "KILL_SESSION", 409);
                                else
                                    this.response = (0, responseHelper_1.generateResponse)({}, "Already logged in", "", 400);
                            }
                        }
                        catch (error) {
                            this.cacheService.removeCacheItem(user._id);
                            let token = jwtHandler_class_1.jwtHandler.signNewToken({
                                id: user._id,
                                deviceId: yield hashHelper_1.HashHelper.encrypt(user_agent),
                                role: user.roleId,
                                expireDate: new Date(new Date().setDate(today.getDate() + 7))
                            }, '7d');
                            this.cacheService.setCacheItem(user._id, { token });
                            this.response = (0, responseHelper_1.generateResponse)({ token }, "Logging in...", "HOME_PAGE", 200);
                            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} logged into the system]`);
                        }
                    }
                    else {
                        let token = jwtHandler_class_1.jwtHandler.signNewToken({
                            id: user._id,
                            deviceId: yield hashHelper_1.HashHelper.encrypt(user_agent),
                            role: user.roleId,
                            expireDate: new Date(new Date().setDate(today.getDate() + 7))
                        }, '7d');
                        this.cacheService.setCacheItem(user._id, { token });
                        this.response = (0, responseHelper_1.generateResponse)({ token }, "Logging in...", "HOME_PAGE", 200);
                        this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} logged into the system]`);
                    }
                }
            }
            else {
                this.response = (0, responseHelper_1.generateResponse)({}, "The email address you entered is not valid", "HOME_PAGE", 404);
            }
            return this.response;
        });
        this.resetSessionAndLogin = (id, user_agent) => __awaiter(this, void 0, void 0, function* () {
            this.response = undefined;
            let user = yield this.userRepository.getById(id);
            let today = new Date();
            if (user) {
                let cachedData = yield this.cacheService.getCacheItem(user._id);
                if (cachedData) {
                    let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(cachedData.token);
                    if (decodedToken.expireDate && decodedToken.deviceId) {
                        if (new Date(Date.parse(decodedToken.expireDate)) > today && !(yield hashHelper_1.HashHelper.compare(user_agent, decodedToken.deviceId))) {
                            this.cacheService.removeCacheItem(user._id);
                            let token = jwtHandler_class_1.jwtHandler.signNewToken({
                                id: user._id,
                                deviceId: yield hashHelper_1.HashHelper.encrypt(user_agent),
                                role: user.roleId,
                                expireDate: new Date(new Date().setDate(today.getDate() + 7))
                            }, '7d');
                            this.cacheService.setCacheItem(user._id, { token });
                            this.response = (0, responseHelper_1.generateResponse)({ token }, "Loggin in...", "HOME_PAGE", 200);
                            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} killed his other session and logged into the system from different device]`);
                        }
                        else
                            this.response = (0, responseHelper_1.generateResponse)({}, "Invalid token", "", 400);
                    }
                }
            }
            else
                this.response = (0, responseHelper_1.generateResponse)({}, "Invalid User.", "", 404);
            return this.response;
        });
        this.resetPassword = (id, currentPassword, newPassword) => __awaiter(this, void 0, void 0, function* () {
            this.response = undefined;
            let user = yield this.userRepository.getById(id);
            if (user) {
                if (!(yield hashHelper_1.HashHelper.compare(currentPassword, user.password)))
                    this.response = (0, responseHelper_1.generateResponse)({}, "Your old password is incorrect.", "TRY_AGAIN", 400);
                else if (yield hashHelper_1.HashHelper.compare(newPassword, user.password))
                    this.response = (0, responseHelper_1.generateResponse)({}, "The new password cannot be the same as the old password.", "", 400);
                else {
                    user.password = yield hashHelper_1.HashHelper.encrypt(newPassword);
                    this.userRepository.update(user._id, user);
                    this.response = (0, responseHelper_1.generateResponse)({}, "Your password has been changed.", "LOGIN_REQUIRED", 200);
                    this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} has change password.]`);
                    this.cacheService.removeCacheItem(user._id);
                }
            }
            else
                this.response = (0, responseHelper_1.generateResponse)({}, "Invalid user operation", "LOGIN_REQURED", 404);
            return this.response;
        });
        this.logOut = (token) => __awaiter(this, void 0, void 0, function* () {
            this.response = undefined;
            let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(token.split(' ')[1]);
            if (decodedToken) {
                let user = yield this.userRepository.getById(decodedToken.id);
                if (user && this.cacheService.getCacheItem(decodedToken.id)) {
                    this.cacheService.removeCacheItem(decodedToken.id);
                    this.response = (0, responseHelper_1.generateResponse)({}, "", "", 200);
                    this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} has left from the system.]`);
                }
            }
            else {
                this.response = (0, responseHelper_1.generateResponse)({}, "Already Logged out.", "", 400);
            }
            return this.response;
        });
        this.userRepository = _userRepository;
        this.mailService = mailProvider_class_1.GmailSender.getInstance();
        this.loggerService = _loggerService;
        this.cacheService = cacheService;
    }
};
exports.AuthenticationUseCases = AuthenticationUseCases;
exports.AuthenticationUseCases = AuthenticationUseCases = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.IRepository)),
    __param(1, (0, inversify_1.inject)(ioc_types_1.Types.LoggerService)),
    __param(2, (0, inversify_1.inject)("ICacheService")),
    __metadata("design:paramtypes", [userRepository_class_1.UserRepository,
        loggerService_class_1.LoggerService,
        redisService_1.CacheService])
], AuthenticationUseCases);
//# sourceMappingURL=authenticationUseCases.js.map