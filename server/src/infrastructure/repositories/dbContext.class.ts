import { Model, Schema, model, FilterQuery } from "mongoose";
import { IEntity } from "../../domain/models/entity.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { injectable } from "inversify";
import 'reflect-metadata';
import { BasePaginateModel } from "../../domain/models/basePaginateReturn.types";

@injectable()
export class DbContext<T extends IEntity> implements IDbContext<T>
{
  model: Model<T>;
  constructor(modelName: string, schema: Schema<T>) {
    this.InitializeConfiguration(modelName, schema);
  }
  InitializeConfiguration = async (modelName: string, schema: Schema<T>) => {
    this.model = model<T>(modelName, schema);
  };
  Create = async (data: Partial<T>): Promise<T> => {
    return this.model.create(data);
  };
  GetById = async (id: string): Promise<T | null | undefined> => {
    return this.model.findById(id).exec();
  };
  Update = async (id: string, data: Partial<T>): Promise<T | null | undefined> => {
    return this.model.findByIdAndUpdate(id, data).exec();
  };
  Delete = async (id: string): Promise<boolean> => {
    return !!await this.model.findByIdAndDelete(id).exec();
  };
  GetAll = async (): Promise<Array<T> | null | undefined> => {
    return this.model.find({}).exec();
  };
  DeleteMany = async (query?: FilterQuery<T>): Promise<void> => {
    this.model.deleteMany(query);
  }
  DeleteAll = async (): Promise<void> => {
    await this.model.deleteMany({});
  }
  FindOne = async (query: FilterQuery<T>): Promise<T | null | undefined> => {
    return this.model.findOne(query);
  }
  FindMultiple = async (page: number, perPage: number, query?: FilterQuery<T>): Promise<BasePaginateModel<T> | null | undefined> => {
    if (page && perPage) {
      const skipCount = (page - 1) * perPage;
      const items = await this.model.find(query).skip(skipCount).limit(perPage).exec();
      const totalItems = await this.model.countDocuments(query);
      const totalPage = Math.ceil(totalItems / perPage);
      if(page > totalPage)
        return null;
      if (items.length > 0 || (page === 1 && totalItems === 0)) {
        const paginationReturn: BasePaginateModel<T> = {
          data: items,
          currentPage: page,
          totalItems: totalItems,
          perPage: perPage,
          totalPage: totalItems % perPage === 0 ? totalPage : totalPage + 1
        };
        return paginationReturn;
      }
    }

    const itemsTotal = await this.model.find(query);
    const totalCount = await this.model.countDocuments(query);
    const allPagination: BasePaginateModel<T> = {
      data: itemsTotal,
      perPage: totalCount,
      totalPage: 1,
      totalItems: totalCount,
      currentPage: 1
    };
    return allPagination;
  };

}
