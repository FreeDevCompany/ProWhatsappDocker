import express, { Router } from 'express';
import IHttpServer from '../../domain/http/server.types';

class HttpServer implements IHttpServer {
    app: express.Application;
    constructor()
    {
        this.app = express();
    }

    start = async (port: number): Promise<void> => {
        this.app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        })
    };

    stop= async () => {

    };
    addRoute = (router: Router) => {
        this.app.use(router);
    };
    
}
export default HttpServer;