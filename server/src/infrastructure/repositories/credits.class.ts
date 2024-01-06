import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { Types } from "../../domain/models/ioc.types";
import 'reflect-metadata';
import { ICredit } from "../../domain/models/credits.types";

@injectable()
export class CreditsRepository extends RepositoryBase<ICredit>
{
    constructor(@inject(Types.IDbContext) @named("creditDbContext") automationDbContext: IDbContext<ICredit>)
    {
        super(automationDbContext);
    }
}