import winston, { format, transport, transports } from "winston";
import { ILogger } from "../../domain/logger/logger";
import 'winston-mongodb';
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from 'fs';
import { injectable } from "inversify";
import 'reflect-metadata';
import globalConfig from "../../domain/logic/config";
@injectable()
export class ConsoleLogger implements ILogger {
    private logger: winston.Logger;
    constructor() {
        this.logger = winston.createLogger(
            {
                transports: [new transports.Console()],
                format: format.combine(
                    format.colorize(),
                    format.timestamp(),
                    format.printf(({ timestamp, level, message, service }) => {
                        return `[${timestamp}] [${service}]-[${level}] => [${message}]]`
                    })
                ),
                defaultMeta: {
                    service: "Pro-Whats-App-Service"
                }
            }
        )
    };
    log = (level: string, message: string | object): void => {
        this.logger.log(level, message);
    }

}
@injectable()
export class FileLogger implements ILogger {
    private logger: winston.Logger;
    private logPath: string;

    constructor() {
        this.logPath = path.join(__dirname, 'logs');
        if(!fs.existsSync(this.logPath))
            fs.mkdirSync(this.logPath); 
        this.logger = winston.createLogger(
            {
                transports: [new DailyRotateFile({
                    filename: path.join(this.logPath, 'app-%DATE%.log'),
                    datePattern: 'DD-MM-YYYY',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '45d',
                })],

                format: format.combine(
                    format.colorize(),
                    format.timestamp(),
                    format.printf(({ timestamp, level, message, service }) => {
                        return `[${timestamp}] [${service}]-[${level.toUpperCase()}] => [${message}]]`
                    })
                ),
                defaultMeta: {
                    service: "Pro-Whats-App-Service"
                }
            }
        )
    }
    log = (level: string, message: string | object): void => {
        this.logger.log(level, message);
    }
}
@injectable()
export class DbLogger implements ILogger {
    private logger: winston.Logger;
    constructor() {
        this.logger = winston.createLogger(
            {
                transports: [new transports.MongoDB({
                    db: globalConfig.mongo as string,
                    options: { useUnifiedTopology: true },
                    collection: 'Logs',
                })],
                format: winston.format.json(),
                defaultMeta: {
                    service: "Pro-Whats-App-Service"
                }
            }
        )
    }
    log = (level: string, message: string | object): void => {
        this.logger.log(level, message);
    }
}
