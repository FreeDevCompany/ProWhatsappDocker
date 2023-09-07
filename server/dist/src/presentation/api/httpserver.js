"use strict";
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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const middlewares_1 = require("../../application/middlewares");
const mailProvider_class_1 = require("../../infrastructure/services/mailProvider.class");
class HttpServer {
    constructor() {
        this.start = (port) => __awaiter(this, void 0, void 0, function* () {
            this.app.listen(port ? port : 3000, () => __awaiter(this, void 0, void 0, function* () {
                yield mongoose_1.default.connect(process.env.MONGO_URL)
                    .then((results) => {
                    console.log("connected to the database");
                }).catch((error) => {
                    console.log(error.message);
                });
                console.log(`server is running on port ${port ? port : 3000}`);
            }));
        });
        this.addRoute = (router) => {
            this.app.use(middlewares_1.GateWayMiddleware.verifyGateWay, router);
        };
        this.app = (0, express_1.default)();
        dotenv_1.default.config();
        this.SetUpConfigs();
    }
    SetUpConfigs() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        mailProvider_class_1.GmailSender.getInstance().createLiveConnection();
        // jwt creation
    }
}
exports.default = HttpServer;
//# sourceMappingURL=httpserver.js.map