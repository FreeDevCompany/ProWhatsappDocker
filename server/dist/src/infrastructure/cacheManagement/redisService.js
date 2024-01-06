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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const ioredis_1 = require("ioredis");
const inversify_1 = require("inversify");
const config_1 = __importDefault(require("../../domain/logic/config"));
let CacheService = class CacheService {
    constructor() {
        this.setCacheItem = (key, item) => {
            this.redisClient.set(key, JSON.stringify(item));
        };
        this.getCacheItem = (key) => __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.redisClient.get(key));
        });
        this.removeCacheItem = (key) => {
            this.redisClient.del(key);
        };
        this.redisClient = new ioredis_1.Redis({
            connectTimeout: 10000,
            host: config_1.default.redis.host,
            port: config_1.default.redis.port,
        });
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CacheService);
//# sourceMappingURL=redisService.js.map