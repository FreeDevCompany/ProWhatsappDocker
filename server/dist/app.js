"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const httpserver_1 = __importDefault(require("./src/presentation/api/httpserver"));
const iocConfigurations_1 = require("./src/presentation/configurations/iocConfigurations");
const server = new httpserver_1.default();
const container = new inversify_1.Container();
iocConfigurations_1.BuildGateway.BuildRepositories(container);
iocConfigurations_1.BuildGateway.BuildLogger(container);
iocConfigurations_1.BuildGateway.BuildServices(container);
server.addRoute(iocConfigurations_1.BuildGateway.BuildAuthRoute(container));
server.addRoute(iocConfigurations_1.BuildGateway.BuildProfileRoute(container));
server.start(process.env.PORT);
//# sourceMappingURL=app.js.map