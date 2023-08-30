import { inject } from "inversify";
import { IRepository } from "../../domain/repositories/repository.types";
import IDbContext from "../../domain/repositories/dbContext.types";
import { IEntity } from "../../domain/models/Entity.types";

export abstract class RepositoryBase<T extends IEntity> implements IRepository<T>
{
    protected dbContext: IDbContext<T>;
    getById: (id: string) => Promise<T>;
    create: (model: T) => Promise<T>;
    update: (id: string, model: T) => Promise<T>;
    delete: (id: string) => Promise<boolean>;
    getAll: () => Promise<Array<T>>;   
}
// getting all data from mongoose or another db configuration
