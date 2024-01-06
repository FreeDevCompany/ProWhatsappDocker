import { Container } from "inversify";
import HttpServer from "./src/presentation/api/httpserver";
import { GatewayBuilder } from "./src/presentation/configurations/iocConfigurations";
import globalConfig from "./src/domain/logic/config";
import { Server } from 'socket.io';

const server: HttpServer = new HttpServer();
const container = new Container();

const logger = GatewayBuilder.BuildLogger(container);
GatewayBuilder.BuildRepositories(container, logger);
GatewayBuilder.BuildServices(container, logger);
server.addRoute(GatewayBuilder.BuildAuthRoute(container, logger));
server.addRoute(GatewayBuilder.BuildProfileRoute(container, logger));
server.addRoute(GatewayBuilder.BuildCustomerRoute(container, logger));
server.addRoute(GatewayBuilder.BuildDraftRoutes(container, logger));
server.addRoute(GatewayBuilder.BuildQuequeRoutes(container, logger));
const controller = GatewayBuilder.BuildSocketServer(container, logger);
server.addSocket(controller);

server.start(globalConfig.port as  unknown as number, logger);

