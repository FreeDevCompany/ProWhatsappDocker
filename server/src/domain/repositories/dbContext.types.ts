import { Connection, FilterQuery, Model, Schema } from "mongoose";
import { IEntity } from "../models/entity.types";
import { injectable } from "inversify";
import { BasePaginateModel } from "../models/basePaginateReturn.types";
export interface IDbContext<T extends IEntity> {
  model: Model<T>;
  InitializeConfiguration: (modelName: string, schema: Schema<T>) => void;
  Create: (data: Partial<T>) => Promise<T>;
  GetById: (id: string) => Promise<T | null | undefined>;
  Update: (id: string, data: Partial<T>) => Promise<T | null | undefined>;
  Delete: (id: string) => Promise<boolean>;
  GetAll: () => Promise<Array<T> | null | undefined>;
  FindOne: (query: FilterQuery<T>) => Promise<T | null | undefined>;
  DeleteAll: () => Promise<void>;
  FindMultiple: (page: number, perPage: number, query?: FilterQuery<T>) => Promise<BasePaginateModel<T> | null | undefined>;
  DeleteMany: (query?: FilterQuery<T>) => Promise<void>;
}

