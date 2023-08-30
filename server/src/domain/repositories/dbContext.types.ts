import { Connection, Model, Schema } from "mongoose";
import { IEntity } from "../models/Entity.types";

interface IDbContext<T extends IEntity>
{
    model: Model<T>;
    InitializeConfiguration: (modelName: string, schema: Schema<T>) => void;
    Create: (data: Partial<T>) => Promise<T>;
    GetById: (id: string) => Promise<T | null | undefined>;
    Update: (id: string, data: Partial<T>) => Promise<T | null | undefined>;
    Delete: (id: string) => Promise<Boolean>;
    GetAll: () => Promise<Array<T> | null | undefined>;
}

export default IDbContext;