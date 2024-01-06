import { inject, injectable, named } from "inversify";
import { IExtraNumber } from "../../domain/models/extraNumbers.types";
import { RepositoryBase } from "./repository.abstract";
import { Types } from "../../domain/models/ioc.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import 'reflect-metadata';
@injectable()
export class ExtraPhoneNumbersRepository extends RepositoryBase<IExtraNumber>
{
    constructor(@inject(Types.IDbContext) @named("extraPhoneDbContext") extraPhoneDbContext: IDbContext<IExtraNumber>) {
        super(extraPhoneDbContext);
    }
}