import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { Types } from "../../domain/models/ioc.types";
import 'reflect-metadata';
import { ICustomer } from "../../domain/models/customers.types";

@injectable()
export class CustomerRepository extends RepositoryBase<ICustomer>
{
    constructor(@inject(Types.IDbContext) @named("customerDbContext") customerDbContext: IDbContext<ICustomer>)
    {
        super(customerDbContext);
    }

    getModel()
    {
        return this.dbContext.model;
    }
}