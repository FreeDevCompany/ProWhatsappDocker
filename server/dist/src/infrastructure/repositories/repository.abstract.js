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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryBase = void 0;
const inversify_1 = require("inversify");
const ioc_types_1 = require("../../domain/models/ioc.types");
require("reflect-metadata");
let RepositoryBase = class RepositoryBase {
    constructor(_dbContext) {
        this.getById = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.dbContext.GetById(id);
        });
        this.create = (model) => __awaiter(this, void 0, void 0, function* () {
            return yield this.dbContext.Create(model);
        });
        this.update = (id, model) => __awaiter(this, void 0, void 0, function* () {
            model.updatedAt = new Date();
            return yield this.dbContext.Update(id, model);
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.dbContext.Delete(id);
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.dbContext.GetAll();
        });
        this.findOne = (query) => __awaiter(this, void 0, void 0, function* () {
            return yield this.dbContext.FindOne(query);
        });
        this.deleteAll = () => __awaiter(this, void 0, void 0, function* () {
            yield this.dbContext.DeleteAll();
        });
        this.findMultiple = (page, perPage, query) => __awaiter(this, void 0, void 0, function* () {
            return yield this.dbContext.FindMultiple(page, perPage, query);
        });
        this.deleteMany = (query) => __awaiter(this, void 0, void 0, function* () {
            yield this.dbContext.DeleteMany(query);
        });
        this.dbContext = _dbContext;
    }
};
exports.RepositoryBase = RepositoryBase;
exports.RepositoryBase = RepositoryBase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(ioc_types_1.Types.IDbContext)),
    __metadata("design:paramtypes", [Object])
], RepositoryBase);
// getting all data from mongoose or another db configuration
//# sourceMappingURL=repository.abstract.js.map