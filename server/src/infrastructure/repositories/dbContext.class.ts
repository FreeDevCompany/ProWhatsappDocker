import { Model, Schema,  model, FilterQuery } from "mongoose";
import { IEntity } from "../../domain/models/entity.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class DbContext<T extends IEntity> implements IDbContext<T>
{
    model: Model<T>;
    constructor(modelName: string, schema: Schema<T>) {
        this.InitializeConfiguration(modelName, schema);
    }
    InitializeConfiguration = async(modelName: string, schema: Schema<T>) => {
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

    FindOne = async(query: FilterQuery<T>): Promise<T | null | undefined> => {
        return  this.model.findOne(query);
    }
}