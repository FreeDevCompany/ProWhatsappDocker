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
exports.GateWayMiddleware = exports.Middleware = void 0;
const jwtHandler_class_1 = require("../infrastructure/services/jwtHandler.class");
const inversify_1 = require("inversify");
const ioc_types_1 = require("./../domain/models/ioc.types");
const loggerService_class_1 = require("../infrastructure/services/loggerService.class");
const redisService_1 = require("../infrastructure/cacheManagement/redisService");
const hashHelper_1 = require("./utilities/hashHelper");
const repositoryService_class_1 = require("../infrastructure/services/repositoryService.class");
const responseHelper_1 = require("./utilities/responseHelper");
let Middleware = class Middleware {
    constructor(loggerServ, cacheService, repoService) {
        this.verifySession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            //todo: refactor verify session middleware
            try {
                const authHeader = req.headers['x-token'];
                const user_agent = req.headers['user-agent'];
                const token = authHeader && authHeader.split(' ')[1];
                if (!token) {
                    throw new Error("Unauthorized");
                }
                const decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(token);
                if (!decodedToken) {
                    throw new Error("Unauthorized");
                }
                const cacheToken = yield this.cacheService.getCacheItem(decodedToken.id);
                const statement = yield hashHelper_1.HashHelper.compare(user_agent, decodedToken.deviceId);
                if (cacheToken.token === token && statement) {
                    next(); // Doğrulama başarılı, sonraki middleware'e geçin
                }
                else {
                    throw new Error("Unauthorized");
                }
            }
            catch (error) {
                res.status(401).json({
                    data: {},
                    message: "Unauthorized",
                    requirement: "LOGIN_REQUIRED",
                    status_code: 401
                });
            }
        });
        this.verifyToken = (req, res, next) => {
            let token = req.headers['x-token'];
            if (!token) {
                // unauthorized
                res.status(401).send({
                    data: {},
                    message: "Unauthorized",
                    requirement: "LOGIN_REQUIRED",
                    status_code: 401
                });
            }
            try {
                const decodedToken = jwtHandler_class_1.jwtHandler.verifyToken(token);
                if (decodedToken) {
                    next();
                }
                else
                    res.status(401).send({ data: {}, message: "Unauthorized", requirement: "LOGIN_REQUIRED", status_code: 401 });
            }
            catch (err) {
                res.status(401).send({
                    data: {},
                    message: "Unauthorized",
                    requirement: "LOGIN_REQUIRED",
                    status_code: 401
                });
            }
        };
        this.isFrozenAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let userId = req.params.user;
            const user = yield this.repositoryService.userRepository.getById(userId);
            let response;
            if (!user) {
                response = (0, responseHelper_1.generateResponse)({}, "Invlid User", "", 404);
                res.status(response.status_code).send(response);
            }
            else {
                if (user.frozenAccount && user.frozenAccount === true) {
                    response = (0, responseHelper_1.generateResponse)({}, "Frozen Account", "", 401);
                    res.status(response.status_code).send(response);
                    this.loggerService.Log(loggerService_class_1.LogType.WARNING, loggerService_class_1.LogLocation.consoleAndFile, `[${userId}] try to requesting server. But this account is the frozen account`);
                }
                else
                    next();
            }
        });
        this.loggerService = loggerServ;
        this.cacheService = cacheService;
        this.repositoryService = repoService;
    }
};
exports.Middleware = Middleware;
exports.Middleware = Middleware = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.LoggerService)),
    __param(1, (0, inversify_1.inject)("ICacheService")),
    __param(2, (0, inversify_1.inject)("RepositoryService")),
    __metadata("design:paramtypes", [loggerService_class_1.LoggerService,
        redisService_1.CacheService,
        repositoryService_class_1.RepositoryService])
], Middleware);
class GateWayMiddleware {
}
exports.GateWayMiddleware = GateWayMiddleware;
GateWayMiddleware.verifyGateWay = (req, res, next) => {
    let gateWay = req.headers['x-api-gateway'];
    if (!gateWay && process.env.GATEWAY_SECRET_KEY !== gateWay)
        res.status(500).json({
            data: {},
            message: "Invalid API Key. Unknown client.",
            requirement: "",
            status_code: 403
        });
    else
        next();
};
//# sourceMappingURL=middlewares.js.map