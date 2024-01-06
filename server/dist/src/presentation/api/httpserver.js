"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const middlewares_1 = require("../../application/middlewares");
const mailProvider_class_1 = require("../../infrastructure/services/mailProvider.class");
const roles_types_1 = require("../../domain/models/roles.types");
const config_1 = __importDefault(require("../../domain/logic/config"));
const wwebjs_mongo_1 = require("wwebjs-mongo");
const socket_io_1 = require("socket.io");
const http = __importStar(require("http"));
const loggerService_class_1 = require("../../infrastructure/services/loggerService.class");
class HttpServer {
    constructor() {
        this.start = (port, logger) => __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect(config_1.default.mongo)
                .then((results) => {
                const store = new wwebjs_mongo_1.MongoStore({ mongoose: mongoose_1.default });
                this.httpServer.listen(port ? port : 3000, () => __awaiter(this, void 0, void 0, function* () {
                    yield (0, roles_types_1.createDefaultRoles)();
                    logger.Log(loggerService_class_1.LogType.INFO, loggerService_class_1.LogLocation.console, `server is running on port ${port ? port : 3000}`);
                }));
            }).catch((error) => {
                logger.Log(loggerService_class_1.LogType.ERROR, loggerService_class_1.LogLocation.consoleAndFile, `[DATABASE ERROR] | ${error}`);
                throw error;
            });
        });
        this.addRoute = (router) => {
            this.app.use(middlewares_1.GateWayMiddleware.verifyGateWay, router);
        };
        this.addSocket = (socketController) => {
            this.socket = new socket_io_1.Server(this.httpServer, {
                cors: {
                    origin: "*"
                },
                transports: ['websocket', 'polling']
            });
            const wpConf = this.socket.of('/api/v1/socket/wp-configuration');
            const userAct = this.socket.of('/api/v1/socket/user-activity');
            const qrCode = this.socket.of('/api/v1/socket/qr-code');
            qrCode.on('connection', socketController.getQrCode);
            userAct.on('connection', socketController.userActivitySocket);
        };
        this.app = (0, express_1.default)();
        this.SetUpConfigs();
    }
    SetUpConfigs() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        mailProvider_class_1.GmailSender.getInstance().createLiveConnection();
        this.httpServer = http.createServer(this.app);
        // jwt creation
    }
}
exports.default = HttpServer;
//# sourceMappingURL=httpserver.js.map