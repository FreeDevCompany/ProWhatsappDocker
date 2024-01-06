import express, {Router} from 'express';
import IHttpServer from '../../domain/http/server.types';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import mongoose, {mongo} from 'mongoose';
import {GateWayMiddleware} from '../../application/middlewares';
import {GmailSender} from '../../infrastructure/services/mailProvider.class';
import {createDefaultRoles} from '../../domain/models/roles.types';
import globalConfig from '../../domain/logic/config';
import {MongoStore} from 'wwebjs-mongo';
import {WebSocketController} from '../../application/controllers/WebSocketController';
import {Server, Socket, Namespace} from 'socket.io';
import * as http from 'http';
import { LogLocation, LogType, LoggerService } from '../../infrastructure/services/loggerService.class';
class HttpServer implements IHttpServer {
    app: express.Application;
    redisClient: any;
    socket: Server;
    httpServer: http.Server;

    constructor() {
        this.app = express();
        this.SetUpConfigs();
    }

    SetUpConfigs() {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        GmailSender.getInstance().createLiveConnection();
        this.httpServer = http.createServer(this.app);
        // jwt creation

    }

    start = async (port: number, logger: LoggerService): Promise<void> => {
        await mongoose.connect(globalConfig.mongo as string)
            .then((results) => {
                const store = new MongoStore({mongoose: mongoose});
                this.httpServer.listen(port ? port : 3000, async () => {
                    await createDefaultRoles();
                    logger.Log(LogType.INFO, LogLocation.console,`server is running on port ${port ? port : 3000}`);
                })
            }).catch((error) => {
                logger.Log(LogType.ERROR, LogLocation.consoleAndFile, `[DATABASE ERROR] | ${error}`)
                throw error;
            })
    };
    addRoute = (router: Router) => {
        this.app.use(GateWayMiddleware.verifyGateWay, router);
    };
    addSocket = (socketController: WebSocketController) => {
        this.socket = new Server(this.httpServer, {
            cors: {
                origin: "*"
            },
            transports: ['websocket', 'polling']
        })
        const wpConf = this.socket.of('/api/v1/socket/wp-configuration');
        const userAct = this.socket.of('/api/v1/socket/user-activity');
        const qrCode = this.socket.of('/api/v1/socket/qr-code');

        qrCode.on('connection', socketController.getQrCode);
        userAct.on('connection', socketController.userActivitySocket);
    }

}

export default HttpServer;