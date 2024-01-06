import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { Types } from "../../domain/models/ioc.types";
import 'reflect-metadata';
import { ICredit } from "../../domain/models/credits.types";
import { ICreditTransaction } from "../../domain/models/creditTransaction.types";

@injectable()
export class CreditTransactionsRepository extends RepositoryBase<ICreditTransaction>
{
    constructor(@inject(Types.IDbContext) @named("creditTransactionsDbContext") creditTransactionDbContext: IDbContext<ICreditTransaction>)
    {
        super(creditTransactionDbContext);
    }
}