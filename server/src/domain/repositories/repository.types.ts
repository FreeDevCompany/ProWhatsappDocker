import { inject } from "inversify";
import { IEntity } from "../models/entity.types";
import { Types } from "../models/ioc.types";
import { FilterQuery } from "mongoose";
import { BasePaginateModel } from "../models/basePaginateReturn.types";

export interface IRepository<T extends IEntity> {
  getById: (id: string) => Promise<T>;
  create: (model: T) => Promise<T>;
  update: (id: string, model: T) => Promise<T>;
  delete: (id: string) => Promise<boolean>;
  getAll: () => Promise<Array<T>>;
  findOne: (query: FilterQuery<T>) => Promise<T>;
  findMultiple: (page: number, perPage: number, query?: FilterQuery<T>) => Promise<BasePaginateModel<T>>;
  deleteMany: (query?: FilterQuery<T>) => Promise<void>;
}
