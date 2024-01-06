import { Application, Router } from "express";
import { LoggerService } from "../../infrastructure/services/loggerService.class";

interface IHttpServer {
    app: Application
    start:(port: number, logger:LoggerService) => Promise<void>;
    addRoute: (router: Router) => void;
}

export default IHttpServer;