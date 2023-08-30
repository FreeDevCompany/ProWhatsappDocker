import { Connection, ConnectOptions, Model, Schema, connect, Document } from "mongoose";
import { IEntity } from "../../domain/models/Entity.types";
import IDbContext from "../../domain/repositories/dbContext.types";


class Connector {
    private connection: Promise<typeof import('mongoose')>;

    constructor(dbUri: string, options?: ConnectOptions)
    {
        this.connection = connect(dbUri, options);
    }
    async getModel<T extends Document>(modelName: string, schema: Schema<T>): Promise<Model<T>>
    {
        const connection = await this.connection;
        return connection.model<T>(modelName, schema);
    }
}

class DbContext<T extends IEntity> implements IDbContext<T>
{
    model: Model<T>;
    constructor(modelName: string, schema: Schema<T>)
    {
        this.InitializeConfiguration(modelName, schema);
    }
    InitializeConfiguration = async(modelName: string, schema: Schema<T>) => {
        const dbContext = new Connector("uri");
        this.model = await dbContext.getModel<T>(modelName, schema);
    };
    Create = async(data: Partial<T>): Promise<T> => {
        return this.model.create(data);
    };
    GetById = async(id: string): Promise<T | null | undefined> => {
        return this.model.findById(id).exec();
    };
    Update = async(id: string, data: Partial<T>): Promise<T | null | undefined> => {
        return this.model.findByIdAndUpdate(id, data).exec();
    };
    Delete = async(id: string): Promise<Boolean> => {
        return !!await this.model.findByIdAndDelete(id).exec();
    };
    GetAll = async(): Promise<Array<T> | null | undefined> => 
    {
        return this.model.find({}).exec();
    };
}
export default DbContext;