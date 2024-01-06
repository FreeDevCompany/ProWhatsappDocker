import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { Types } from "../../domain/models/ioc.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import 'reflect-metadata';
import { IQueque } from "../../domain/models/queque.types";
import { IQuequeItem } from "../../domain/models/quequeItem.types";

@injectable()
export class QuequeItemRepository extends RepositoryBase<IQuequeItem>
{
    constructor(@inject(Types.IDbContext) @named("quequeItemDbContext") quequeDbContext: IDbContext<IQuequeItem>)
    {
        super(quequeDbContext);
    }
    getModel()
    {
        return this.dbContext.model;
    }
}