import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { Types } from "../../domain/models/ioc.types";
import 'reflect-metadata';
import { ICustomerGroup } from "../../domain/models/customerGroup.types";
import { DbContext } from "./dbContext.class";

@injectable()
export class CustomerGroupRepository extends RepositoryBase<ICustomerGroup>
{
    constructor(@inject(Types.IDbContext) @named("customerGroupDbContext") customerGroupDbContext: IDbContext<ICustomerGroup>)
    {
        super(customerGroupDbContext);
    }

    getModel()
    {
        return this.dbContext.model;
    }
}