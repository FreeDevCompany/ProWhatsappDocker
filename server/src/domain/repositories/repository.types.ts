import { inject } from "inversify";
import { IEntity } from "../models/entity.types";
import { Types } from "../models/ioc.types";
import { FilterQuery } from "mongoose";

export interface IRepository<T extends IEntity> {
    getById: (id: string) => Promise<T>;
    create: (model: T) => Promise<T>;
    update: (id: string, model: T) => Promise<T>;
    delete: (id: string) => Promise<boolean>;
    getAll: () => Promise<Array<T>>;
    findOne: (query: FilterQuery<T>) => Promise<T>;
}