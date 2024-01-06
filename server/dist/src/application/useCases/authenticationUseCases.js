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
const hashHelper_1 = require("../utilities/hashHelper");
const loggerService_class_1 = require("../../infrastructure/services/loggerService.class");
const jwtHandler_class_1 = require("../../infrastructure/services/jwtHandler.class");
const linkHelper_1 = require("../utilities/linkHelper");
const responseHelper_1 = require("../utilities/responseHelper");
const repositoryService_class_1 = require("../../infrastructure/services/repositoryService.class");
const codeGenerator_1 = require("../utilities/codeGenerator");
let AuthenticationUseCases = class AuthenticationUseCases {
    constructor(repositoryService, loggerService, cacheService) {
        this.registerUser = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                let foundUser = yield this.repositoryService.userRepository.findOne({
                    $or: [{ email: body.email }, { phone: body.phone }]
                });
                let isHave = yield this.repositoryService.extraPhoneRepo.findOne({ phone: body.phone });
                if (isHave)
                    return (0, responseHelper_1.generateResponse)({}, "There is a user registered in the system with this credentials.", "USED_CREDENTIALS", 400);
                if (foundUser) {
                    this.loggerService.Log(loggerService_class_1.LogType.WARNING, loggerService_class_1.LogLocation.consoleAndFile, "The client is trying to register again with the information registered in the system.");
                    return (0, responseHelper_1.generateResponse)({}, "There is a user registered in the system with this credentials.", "USED_CREDENTIALS", 400);
                }
                let saved = yield this.createUser(body);
                this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.all, `The email has been sent. A new user has joined us. ${saved._id}`);
                return (0, responseHelper_1.generateResponse)({}, "Successfully Registered. Email Has been sent for verification.", "GOTO_HOME_PAGE", 201);
            }
            catch (error) {
                this.loggerService.Log(loggerService_class_1.LogType.ERROR, loggerService_class_1.LogLocation.consoleAndFile, error.message);
                return (0, responseHelper_1.generateResponse)({}, error.message, "", 500);
            }
        });
        this.verifyEmail = (body) => __awaiter(this, void 0, void 0, function* () {
            let isFound = yield this.repositoryService.userRepository.getById(body.userId);
            if (!isFound)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User.", "", 404);
            if ((isFound.verified === true && isFound.email_hash))
                return (0, responseHelper_1.generateResponse)({}, "Email verification has already been completed.", "LOGIN_REQUIRED", 400);
            let hashCompareVal = `${isFound.email}${isFound._id}`;
            if (!(yield hashHelper_1.HashHelper.compare(hashCompareVal, body.email_hash)))
                return (0, responseHelper_1.generateResponse)({}, "Email verification has already been completed.", "LOGIN_REQUIRED", 400);
            isFound.verified = true;
            isFound.email_hash = body.email_hash;
            yield this.repositoryService.creditRepository.create({
                userId: isFound._id,
                totalAmount: 100,
            });
            let createdData = yield this.repositoryService.automationSettingsRepo.create({
                userId: isFound._id,
                beginTime: new Date(),
                max_message_delay: 10,
                min_message_delay: 0,
            });
            yield this.repositoryService.userRepository.update(body.userId, isFound);
            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${isFound._id}] verified email.`);
            return (0, responseHelper_1.generateResponse)({}, "Email verified Successfully.", "LOGIN_REQUIRED", 200);
        });
        this.getForgotPasswordLink = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                let isFound = yield this.repositoryService.userRepository.findOne({ email: body.email });
                if (!isFound)
                    return (0, responseHelper_1.generateResponse)({}, "There is no registered user with this email.", "", 400);
                let forgotToken = jwtHandler_class_1.jwtHandler.signNewToken({
                    email: isFound.email,
                    id: isFound._id
                }, '5m');
                this.cacheService.setCacheItem(`${body.user_agent}-forgotPass`, { token: forgotToken });
                yield linkHelper_1.LinkHelper.SendForgotPasswordLink(isFound.email, isFound._id, forgotToken);
                this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `Email has been sent to ${isFound._id} for forgot password operation.`);
                return (0, responseHelper_1.generateResponse)({}, "The email has been sent to your account", "CONFIRM_FORGOT_PASSWROD", 200);
            }
            catch (error) {
                this.loggerService.Log(loggerService_class_1.LogType.ERROR, loggerService_class_1.LogLocation.all, error.message);
                return (0, responseHelper_1.generateResponse)({}, error.message, "", 500);
            }
        });
        this.getForgotPasswordConfirm = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                let storedForgotPassToken = yield this.cacheService.getCacheItem(`${body.user_agent}-forgotPass`);
                if (!storedForgotPassToken)
                    return (0, responseHelper_1.generateResponse)({}, "Forgot Password time has expired", "", 404);
                let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(storedForgotPassToken.token);
                if (decodedToken && decodedToken.id && decodedToken.email) {
                    let user = yield this.repositoryService.userRepository.getById(decodedToken.id);
                    if (yield hashHelper_1.HashHelper.compare(body.password, user.password))
                        return (0, responseHelper_1.generateResponse)({}, "The new password cannot be the same as the old password.", "", 400);
                    user.password = yield hashHelper_1.HashHelper.encrypt(body.password);
                    yield this.repositoryService.userRepository.update(decodedToken.id, user);
                    this.cacheService.removeCacheItem(`${body.user_agent}-forgotPass`);
                    this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `${user._id} has changed his password. [FORGOT PASSWORD]`);
                    return (0, responseHelper_1.generateResponse)({}, "The password has been successfully changed.", "LOGIN_REQUIRED", 200);
                }
            }
            catch (error) {
                return (0, responseHelper_1.generateResponse)({}, "The time limit for password reset has expired.", "", 404);
            }
        });
        this.Login = (body) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repositoryService.userRepository.getAllDataWithPopulate('roleId', 'Role', undefined, body.email);
            let today = new Date();
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "The email address you entered is not valid", "HOME_PAGE", 404);
            if (!(yield hashHelper_1.HashHelper.compare(body.password, user.password)))
                return (0, responseHelper_1.generateResponse)({}, "The password you entered is incorrect", "LOGIN_REQUIRED", 400);
            if (user.verified === false)
                return (0, responseHelper_1.generateResponse)({}, "You need to verify your e-mail.", "VERIFY_EMAIL", 403);
            if (user.frozenAccount && user.frozenAccount === true)
                return (0, responseHelper_1.generateResponse)({ id: user._id.toString() }, "Your account is frozen. Would you like to reactivate your account?", "FROZEN_ACCOUNT", 401);
            let cacheControl = yield this.cacheService.getCacheItem(user._id);
            if (cacheControl) {
                try {
                    const storedToken = jwtHandler_class_1.jwtHandler.verifyToken(cacheControl.token);
                    if (storedToken.expireDate && storedToken.deviceId) {
                        if (new Date(Date.parse(storedToken.expireDate)) > today && !(yield hashHelper_1.HashHelper.compare(body.user_agent, storedToken.deviceId)))
                            return (0, responseHelper_1.generateResponse)({ id: storedToken.id }, "You have an open session. Would you like to end your current session and continue from here?", "KILL_SESSION", 409);
                        else {
                            return (0, responseHelper_1.generateResponse)({ token: cacheControl.token, expireDate: storedToken.expireDate, id: storedToken.id }, "Already logged in", "", 200);
                        }
                    }
                }
                catch (error) {
                    this.cacheService.removeCacheItem(user._id);
                }
            }
            const token = jwtHandler_class_1.jwtHandler.signNewToken({
                id: user._id,
                deviceId: yield hashHelper_1.HashHelper.encrypt(body.user_agent),
                role: user.roleId,
                expireDate: new Date(new Date().setDate(today.getDate() + 7))
            });
            this.cacheService.setCacheItem(user._id, { token });
            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} logged into the system]`);
            return (0, responseHelper_1.generateResponse)({
                id: user._id.toString(),
                token: token, expireDate: (new Date(new Date().setDate(today.getDay() + 7)))
            }, "Logging in...", "HOME_PAGE", 200);
        });
        this.resetSessionAndLogin = (body) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repositoryService.userRepository.getAllDataWithPopulate('roleId', 'Role', body.id, undefined);
            let today = new Date();
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User.", "", 404);
            let cachedData = yield this.cacheService.getCacheItem(body.id);
            if (cachedData) {
                try {
                    let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(cachedData.token);
                    if (decodedToken.expireDate && decodedToken.deviceId) {
                        if (!(new Date(Date.parse(decodedToken.expireDate)) > today && !(yield hashHelper_1.HashHelper.compare(body.user_agent, decodedToken.deviceId))))
                            return (0, responseHelper_1.generateResponse)({}, "Invalid token", "", 400);
                        this.cacheService.removeCacheItem(body.id);
                        let token = jwtHandler_class_1.jwtHandler.signNewToken({
                            id: body.id,
                            deviceId: yield hashHelper_1.HashHelper.encrypt(body.user_agent),
                            role: user.roleId,
                            expireDate: new Date(new Date().setDate(today.getDate() + 7))
                        }, '7d');
                        this.cacheService.setCacheItem(body.id, { token });
                        this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} killed his other session and logged into the system from different device]`);
                        return (0, responseHelper_1.generateResponse)({
                            id: user._id.toString(),
                            token: token, expireDate: (new Date(new Date().setDate(today.getDay() + 7)))
                        }, "Loggin in...", "HOME_PAGE", 200);
                    }
                }
                catch (error) {
                    return (0, responseHelper_1.generateResponse)({}, "Invalid token", "", 400);
                }
            }
        });
        this.resetPassword = (body) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repositoryService.userRepository.getById(body.id);
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid user operation", "LOGIN_REQURED", 404);
            if (!(yield hashHelper_1.HashHelper.compare(body.currentPassword, user.password)))
                return (0, responseHelper_1.generateResponse)({}, "Your old password is incorrect.", "TRY_AGAIN", 400);
            if (yield hashHelper_1.HashHelper.compare(body.newPassword, user.password))
                return (0, responseHelper_1.generateResponse)({}, "The new password cannot be the same as the old password.", "", 400);
            user.password = yield hashHelper_1.HashHelper.encrypt(body.newPassword);
            yield this.repositoryService.userRepository.update(user._id, user);
            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} has change password.]`);
            this.cacheService.removeCacheItem(user._id);
            return (0, responseHelper_1.generateResponse)({}, "Your password has been changed.", "LOGIN_REQUIRED", 200);
        });
        this.logOut = (body) => __awaiter(this, void 0, void 0, function* () {
            let decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(body.token.split(' ')[1]);
            if (decodedToken) {
                let user = yield this.repositoryService.userRepository.getById(decodedToken.id);
                if (user && (yield this.cacheService.getCacheItem(decodedToken.id))) {
                    this.cacheService.removeCacheItem(decodedToken.id);
                    this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id} has left from the system.]`);
                    return (0, responseHelper_1.generateResponse)({}, "", "", 200);
                }
            }
            else {
                return (0, responseHelper_1.generateResponse)({}, "Already Logged out.", "", 400);
            }
        });
        this.freezeAccount = (body) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repositoryService.userRepository.getById(body.user);
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User", "", 404);
            if (!(yield hashHelper_1.HashHelper.compare(body.password, user.password)))
                return (0, responseHelper_1.generateResponse)({}, "The password you entered is incorrect", "", 400);
            if (user.frozenAccount && user.frozenAccount === true)
                return (0, responseHelper_1.generateResponse)({}, "This account already frozen.", "", 400);
            user.frozenAccount = true;
            user.frozenAccountCode = codeGenerator_1.CodeGenerator.generateVerificationCode(6);
            yield this.repositoryService.userRepository.update(user._id.toString(), user);
            const cacheItem = yield this.cacheService.getCacheItem(user._id.toString());
            if (cacheItem) {
                this.cacheService.removeCacheItem(user._id.toString());
            }
            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.all, `[${user._id.toString()}] has frozen his/her account`);
            return (0, responseHelper_1.generateResponse)({}, "Your account has been successfully frozen", "", 200);
        });
        this.reactivateAccountLink = (body) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repositoryService.userRepository.getById(body.user);
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User", "", 404);
            if (user.frozenAccount && user.frozenAccount === false)
                return (0, responseHelper_1.generateResponse)({}, "Your account is already active", "REACTIVATE_ACCOUNT", 400);
            const code = user.frozenAccountCode;
            yield linkHelper_1.LinkHelper.SendActivationLink(user.email, user._id.toString(), code);
            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `Reactivation Email Has been sent to [${user._id.toString()}]`);
            return (0, responseHelper_1.generateResponse)({}, "The reactivation email has been sent to your account", "", 200);
        });
        this.reactivateAccountConfirm = (body) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repositoryService.userRepository.getById(body.user);
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User", "", 404);
            if (user.frozenAccount && user.frozenAccount === false)
                return (0, responseHelper_1.generateResponse)({}, "Your account already activated.", "", 400);
            if (user.frozenAccount && user.frozenAccount === true) {
                let match = user.frozenAccountCode === body.code;
                if (match) {
                    console.log("matched");
                    user.frozenAccount = false;
                    user.frozenAccountCode = "";
                    yield this.repositoryService.userRepository.update(user._id.toString(), user);
                    this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id.toString()}] has been activated his/her account`);
                    return (0, responseHelper_1.generateResponse)({}, "Your account has been activated", "", 200);
                }
            }
        });
        this.deleteAccount = (body) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repositoryService.userRepository.getById(body.user);
            if (!user)
                return (0, responseHelper_1.generateResponse)({}, "Invalid User", "", 404);
            if (!(yield hashHelper_1.HashHelper.compare(body.password, user.password)))
                return (0, responseHelper_1.generateResponse)({}, "The password you entered is incorrect", "", 400);
            const cacheItem = yield this.cacheService.getCacheItem(user._id.toString());
            if (cacheItem) {
                this.cacheService.removeCacheItem(user._id.toString());
            }
            yield this.repositoryService.automationSettingsRepo.deleteMany({ userId: user });
            yield this.repositoryService.creditRepository.deleteMany({ userId: user });
            yield this.repositoryService.customerGroupRepository.deleteMany({ userId: user });
            yield this.repositoryService.extraPhoneRepo.deleteMany({ userId: user });
            yield this.repositoryService.quequeRepository.deleteMany({ userId: user });
            yield this.repositoryService.userRepository.delete(user._id.toString());
            this.loggerService.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.consoleAndFile, `[${user._id.toString()}] has been deleted his/her account`);
            return (0, responseHelper_1.generateResponse)({}, "", "", 200);
        });
        this.loggerService = loggerService;
        this.cacheService = cacheService;
        this.repositoryService = repositoryService;
    }
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const encryptedPassword = yield hashHelper_1.HashHelper.encrypt(body.password);
            const roleId = (yield this.repositoryService.roleRepository.findOne({ roleName: 'User' }))._id;
            const saved = yield this.repositoryService.userRepository.create({
                avatar: body.avatar,
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phone,
                email: body.email,
                password: encryptedPassword,
                extraNumberCount: 0,
                roleId: roleId
            });
            yield linkHelper_1.LinkHelper.SendVerifyEmail(saved.email, saved._id);
            return saved;
        });
    }
};
exports.AuthenticationUseCases = AuthenticationUseCases;
exports.AuthenticationUseCases = AuthenticationUseCases = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("RepositoryService")),
    __param(1, (0, inversify_1.inject)(ioc_types_1.Types.LoggerService)),
    __param(2, (0, inversify_1.inject)("ICacheService")),
    __metadata("design:paramtypes", [repositoryService_class_1.RepositoryService,
        loggerService_class_1.LoggerService, Object])
], AuthenticationUseCases);
//# sourceMappingURL=authenticationUseCases.js.map