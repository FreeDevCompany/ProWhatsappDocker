import { Container } from "inversify";
import HttpServer from "./src/presentation/api/httpserver";
import { BuildGateway } from "./src/presentation/configurations/iocConfigurations";

const server: HttpServer = new HttpServer();
const container = new Container();
BuildGateway.BuildLogger(container);
server.addRoute(BuildGateway.BuildAuthRoute(container));
server.start(process.env.PORT as unknown as number);
