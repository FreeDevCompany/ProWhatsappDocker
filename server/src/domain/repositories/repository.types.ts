import { IEntity } from "../models/Entity.types";

export interface IRepository<T extends IEntity> {
    getById: (id: string) => Promise<T>;
    create: (model: T) => Promise<T>;
    update: (id: string, model: T) => Promise<T>;
    delete: (id: string) => Promise<boolean>;
    getAll: () => Promise<Array<T>>;
}