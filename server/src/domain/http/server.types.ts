import { Application, Router } from "express";

interface IHttpServer {
    app: Application
    start:(port: number) => Promise<void>;
    addRoute: (router: Router) => void;
}

export default IHttpServer;