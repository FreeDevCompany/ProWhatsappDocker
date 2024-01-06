import { inject, injectable } from "inversify";
import { IRepository } from "../../domain/repositories/repository.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { IEntity } from "../../domain/models/entity.types";
import { Types } from "../../domain/models/ioc.types";
import 'reflect-metadata';
import { FilterQuery } from "mongoose";
import { query } from "express";
import { BasePaginateModel } from "../../domain/models/basePaginateReturn.types";
@injectable()
export abstract class RepositoryBase<T extends IEntity> implements IRepository<T>
{
  protected dbContext: IDbContext<T>;
  constructor(@inject(Types.IDbContext) _dbContext: IDbContext<T>) {
    this.dbContext = _dbContext;
  }
  getById = async (id: string): Promise<T> => {
    return await this.dbContext.GetById(id);
  };
  create = async (model: T): Promise<T> => {
    return await this.dbContext.Create(model);
  };
  update = async (id: string, model: T): Promise<T> => {
    model.updatedAt = new Date();
    return await this.dbContext.Update(id, model);
  };
  delete = async (id: string): Promise<boolean> => {
    return await this.dbContext.Delete(id);
  };
  getAll = async (): Promise<Array<T>> => {
    return await this.dbContext.GetAll();
  };
  findOne = async (query: FilterQuery<T>): Promise<T> => {
    return await this.dbContext.FindOne(query);
  }
  deleteAll = async () => {
    await this.dbContext.DeleteAll();
  }
  findMultiple = async (page: number, perPage: number, query?: FilterQuery<T>): Promise<BasePaginateModel<T>> => {
    return await this.dbContext.FindMultiple(page, perPage, query);
  }
  deleteMany = async (query?: FilterQuery<T>): Promise<void> => {
    await this.dbContext.DeleteMany(query);
  }
}
// getting all data from mongoose or another db configuration
