import express, { Router } from 'express';
import IHttpServer from '../../domain/http/server.types';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import { results } from 'inversify-express-utils';
import { error } from 'console';
import { GateWayMiddleware } from '../../application/middlewares';
class HttpServer implements IHttpServer {
    app: express.Application;
    constructor()
    {
        this.app = express();
        dotenv.config()
        this.SetUpConfigs();
    }

    SetUpConfigs()
    {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(bodyParser.json());
        
        // jwt creation
    }

    start = async (port: number): Promise<void> => {
        this.app.listen(port ? port : 3000, async() => {
            await mongoose.connect(process.env.MONGO_URL)
            .then((results) => {
                console.log("connected to the database");
            }).catch((error) => {
                console.log(error.message);
            })
            console.log(`server is running on port ${port ? port : 3000}`);
        
        })
    };
    addRoute = (router: Router) => {
        this.app.use(GateWayMiddleware.verifyGateWay,router);
    };
}
export default HttpServer;