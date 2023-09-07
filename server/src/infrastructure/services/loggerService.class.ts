import { inject, injectable, named } from "inversify";
import { ILogger } from "../../domain/logger/logger";
import { Types } from "../../domain/models/ioc.types";
import { ConsoleLogger, DbLogger, FileLogger } from "../logManagement/logger";


export enum LogType {
    INFO = 'info',
    WARNING = 'warn',
    ERROR = 'error'
}
export enum LogLocation {
    console = 0,
    file = 1,
    db = 2,

    consoleAndFile = 3,
    consoleAndDb = 4,
    all = 5,
}

@injectable()
export class LoggerService {
    fileLogger: ILogger;
    dbLogger: ILogger;
    consoleLogger: ILogger;

    constructor(
        @inject(Types.ILogger) @named('fileLogger') fileLogger: FileLogger, 
        @inject(Types.ILogger) @named('dbLogger') dbLogger: DbLogger, 
        @inject(Types.ILogger) @named('consoleLogger') consoleLogger: ConsoleLogger) {
        this.fileLogger = fileLogger;
        this.consoleLogger = consoleLogger;
        this.dbLogger = dbLogger;
    }


    Log(type: LogType, location: LogLocation, message: object | string) {
        switch (location) {
            case LogLocation.all:
                {
                    this.consoleLogger.log(type, message);
                    this.fileLogger.log(type, message);
                    this.dbLogger.log(type, message);
                    break;
                }
            case LogLocation.consoleAndDb:
                {
                    this.consoleLogger.log(type, message);
                    this.dbLogger.log(type, message);
                    break;
                }
            case LogLocation.consoleAndFile:
                {
                    this.consoleLogger.log(type, message);
                    this.fileLogger.log(type, message);
                    break;
                }
            case LogLocation.console:
                {
                    this.consoleLogger.log(type, message);
                    break;
                }
            case LogLocation.db:
                {
                    this.dbLogger.log(type, message);
                }
            case LogLocation.file:
                {
                    this.fileLogger.log(type, message);
                    break;
                }
        }

    }

}