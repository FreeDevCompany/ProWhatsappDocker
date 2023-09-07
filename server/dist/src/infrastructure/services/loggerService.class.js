"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = exports.LogLocation = exports.LogType = void 0;
const inversify_1 = require("inversify");
const ioc_types_1 = require("../../domain/models/ioc.types");
const logger_1 = require("../logManagement/logger");
var LogType;
(function (LogType) {
    LogType["INFO"] = "info";
    LogType["WARNING"] = "warn";
    LogType["ERROR"] = "error";
})(LogType || (exports.LogType = LogType = {}));
var LogLocation;
(function (LogLocation) {
    LogLocation[LogLocation["console"] = 0] = "console";
    LogLocation[LogLocation["file"] = 1] = "file";
    LogLocation[LogLocation["db"] = 2] = "db";
    LogLocation[LogLocation["consoleAndFile"] = 3] = "consoleAndFile";
    LogLocation[LogLocation["consoleAndDb"] = 4] = "consoleAndDb";
    LogLocation[LogLocation["all"] = 5] = "all";
})(LogLocation || (exports.LogLocation = LogLocation = {}));
let LoggerService = class LoggerService {
    constructor(fileLogger, dbLogger, consoleLogger) {
        this.fileLogger = fileLogger;
        this.consoleLogger = consoleLogger;
        this.dbLogger = dbLogger;
    }
    Log(type, location, message) {
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
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.ILogger)),
    __param(0, (0, inversify_1.named)("fileLogger")),
    __param(1, (0, inversify_1.inject)(ioc_types_1.Types.ILogger)),
    __param(1, (0, inversify_1.named)("dbLogger")),
    __param(2, (0, inversify_1.inject)(ioc_types_1.Types.ILogger)),
    __param(2, (0, inversify_1.named)("consoleLogger")),
    __metadata("design:paramtypes", [logger_1.FileLogger,
        logger_1.DbLogger,
        logger_1.ConsoleLogger])
], LoggerService);
//# sourceMappingURL=loggerService.class.js.map