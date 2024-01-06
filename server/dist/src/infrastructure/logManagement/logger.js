"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbLogger = exports.FileLogger = exports.ConsoleLogger = void 0;
const winston_1 = __importStar(require("winston"));
require("winston-mongodb");
const path_1 = __importDefault(require("path"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const fs_1 = __importDefault(require("fs"));
const inversify_1 = require("inversify");
require("reflect-metadata");
const config_1 = __importDefault(require("../../domain/logic/config"));
let ConsoleLogger = class ConsoleLogger {
    constructor() {
        this.log = (level, message) => {
            this.logger.log(level, message);
        };
        this.logger = winston_1.default.createLogger({
            transports: [new winston_1.transports.Console()],
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message, service }) => {
                return `[${timestamp}] [${service}]-[${level}] => [${message}]]`;
            })),
            defaultMeta: {
                service: "Pro-Whats-App-Service"
            }
        });
    }
    ;
};
exports.ConsoleLogger = ConsoleLogger;
exports.ConsoleLogger = ConsoleLogger = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ConsoleLogger);
let FileLogger = class FileLogger {
    constructor() {
        this.log = (level, message) => {
            this.logger.log(level, message);
        };
        this.logPath = path_1.default.join(__dirname, 'logs');
        if (!fs_1.default.existsSync(this.logPath))
            fs_1.default.mkdirSync(this.logPath);
        this.logger = winston_1.default.createLogger({
            transports: [new winston_daily_rotate_file_1.default({
                    filename: path_1.default.join(this.logPath, 'app-%DATE%.log'),
                    datePattern: 'DD-MM-YYYY',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '45d',
                })],
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message, service }) => {
                return `[${timestamp}] [${service}]-[${level.toUpperCase()}] => [${message}]]`;
            })),
            defaultMeta: {
                service: "Pro-Whats-App-Service"
            }
        });
    }
};
exports.FileLogger = FileLogger;
exports.FileLogger = FileLogger = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], FileLogger);
let DbLogger = class DbLogger {
    constructor() {
        this.log = (level, message) => {
            this.logger.log(level, message);
        };
        this.logger = winston_1.default.createLogger({
            transports: [new winston_1.transports.MongoDB({
                    db: config_1.default.mongo,
                    options: { useUnifiedTopology: true },
                    collection: 'Logs',
                })],
            format: winston_1.default.format.json(),
            defaultMeta: {
                service: "Pro-Whats-App-Service"
            }
        });
    }
};
exports.DbLogger = DbLogger;
exports.DbLogger = DbLogger = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DbLogger);
//# sourceMappingURL=logger.js.map