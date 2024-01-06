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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbContext = void 0;
const mongoose_1 = require("mongoose");
const inversify_1 = require("inversify");
require("reflect-metadata");
let DbContext = class DbContext {
    constructor(modelName, schema) {
        this.InitializeConfiguration = (modelName, schema) => __awaiter(this, void 0, void 0, function* () {
            this.model = (0, mongoose_1.model)(modelName, schema);
        });
        this.Create = (data) => __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
        this.GetById = (id) => __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id).exec();
        });
        this.Update = (id, data) => __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(id, data).exec();
        });
        this.Delete = (id) => __awaiter(this, void 0, void 0, function* () {
            return !!(yield this.model.findByIdAndDelete(id).exec());
        });
        this.GetAll = () => __awaiter(this, void 0, void 0, function* () {
            return this.model.find({}).exec();
        });
        this.DeleteMany = (query) => __awaiter(this, void 0, void 0, function* () {
            this.model.deleteMany(query);
        });
        this.DeleteAll = () => __awaiter(this, void 0, void 0, function* () {
            yield this.model.deleteMany({});
        });
        this.FindOne = (query) => __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(query);
        });
        this.FindMultiple = (page, perPage, query) => __awaiter(this, void 0, void 0, function* () {
            if (page && perPage) {
                const skipCount = (page - 1) * perPage;
                const items = yield this.model.find(query).skip(skipCount).limit(perPage).exec();
                const totalItems = yield this.model.countDocuments(query);
                const totalPage = Math.ceil(totalItems / perPage);
                if (page > totalPage)
                    return null;
                if (items.length > 0 || (page === 1 && totalItems === 0)) {
                    const paginationReturn = {
                        data: items,
                        currentPage: page,
                        totalItems: totalItems,
                        perPage: perPage,
                        totalPage: totalItems % perPage === 0 ? totalPage : totalPage + 1
                    };
                    return paginationReturn;
                }
            }
            const itemsTotal = yield this.model.find(query);
            const totalCount = yield this.model.countDocuments(query);
            const allPagination = {
                data: itemsTotal,
                perPage: totalCount,
                totalPage: 1,
                totalItems: totalCount,
                currentPage: 1
            };
            return allPagination;
        });
        this.InitializeConfiguration(modelName, schema);
    }
};
exports.DbContext = DbContext;
exports.DbContext = DbContext = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [String, mongoose_1.Schema])
], DbContext);
//# sourceMappingURL=dbContext.class.js.map