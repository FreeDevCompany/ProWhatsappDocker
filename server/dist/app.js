"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const httpserver_1 = __importDefault(require("./src/presentation/api/httpserver"));
const iocConfigurations_1 = require("./src/presentation/configurations/iocConfigurations");
const config_1 = __importDefault(require("./src/domain/logic/config"));
const server = new httpserver_1.default();
const container = new inversify_1.Container();
const logger = iocConfigurations_1.GatewayBuilder.BuildLogger(container);
iocConfigurations_1.GatewayBuilder.BuildRepositories(container, logger);
iocConfigurations_1.GatewayBuilder.BuildServices(container, logger);
server.addRoute(iocConfigurations_1.GatewayBuilder.BuildAuthRoute(container, logger));
server.addRoute(iocConfigurations_1.GatewayBuilder.BuildProfileRoute(container, logger));
server.addRoute(iocConfigurations_1.GatewayBuilder.BuildCustomerRoute(container, logger));
server.addRoute(iocConfigurations_1.GatewayBuilder.BuildDraftRoutes(container, logger));
server.addRoute(iocConfigurations_1.GatewayBuilder.BuildQuequeRoutes(container, logger));
const controller = iocConfigurations_1.GatewayBuilder.BuildSocketServer(container, logger);
server.addSocket(controller);
server.start(config_1.default.port, logger);
//# sourceMappingURL=app.js.map