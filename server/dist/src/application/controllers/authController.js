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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const ioc_types_1 = require("../../domain/models/ioc.types");
const authenticationUseCases_1 = require("../useCases/authenticationUseCases");
const errorHandler_1 = require("../utilities/errorHandler");
let AuthController = class AuthController {
    constructor(_service) {
        /**
         * This method register operation for the user who wants to use this otomation applciation
         * This method called from register endpoint and the methods want to specific data from the new user.
         * @param avatar: string
         * @param firstName: string
         * @param lastName: string
         * @param email: string
         * @param password: string
         * @param phone: string
         * @param areaCode: string (not integrated == feature)
         *
         */
        this.SignUp = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            let signUpBody = req.body;
            let response = yield this.useCaseService.createUser(signUpBody);
            return res.status(response.status_code).json(response);
        }));
        this.VerifyEmail = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const email_hash = decodeURIComponent(req.query.hash);
            let response = yield this.useCaseService.verifyEmail(id, email_hash);
            return res.status(response.status_code).json(response);
        }));
        this.Login = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_agent = req.headers['user-agent'];
            const { email, password } = req.body;
            let response = yield this.useCaseService.Login(user_agent, email, password);
            return res.status(response.status_code).json(response);
        }));
        this.Logout = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.headers['x-token'];
            let response = yield this.useCaseService.logOut(token);
            return res.status(response.status_code).json(response);
        }));
        this.ResetSessionAndLogin = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_agent = req.headers['user-agent'];
            const { id } = req.body;
            let response = yield this.useCaseService.resetSessionAndLogin(id, user_agent);
            return res.status(response.status_code).json(response);
        }));
        this.ResetPassword = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, currentPassword, newPassword } = req.body;
            let response = yield this.useCaseService.resetPassword(id, currentPassword, newPassword);
            return res.status(response.status_code).json(response);
        }));
        this.ForgotPasswordLink = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const user_agent = req.headers['user-agent'];
            let response = yield this.useCaseService.getForgotPasswordLink(email, user_agent);
            return res.status(response.status_code).json(response);
        }));
        this.ForgotPasswordConfirm = errorHandler_1.ErrorHandler.UnhandledExceptionHanlder((req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = decodeURIComponent(req.params.token);
            console.log(token);
            const password = req.body.password;
            const user_agent = req.headers['user-agent'];
            let response = yield this.useCaseService.getForgotPasswordConfirm(token, password, user_agent);
            return res.status(response.status_code).json(response);
        }));
        this.OtpVerification = (req, res) => __awaiter(this, void 0, void 0, function* () {
        });
        this.useCaseService = _service;
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.UserUseCases)),
    __metadata("design:paramtypes", [authenticationUseCases_1.AuthenticationUseCases])
], AuthController);
//# sourceMappingURL=authController.js.map