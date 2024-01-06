import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { IRole } from "../../domain/models/roles.types";
import { Types } from "../../domain/models/ioc.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import 'reflect-metadata';

@injectable()
export class RoleRepository extends RepositoryBase<IRole>
{
    constructor(@inject(Types.IDbContext) @named("rolesDbContext") rolesDbContext: IDbContext<IRole>)
    {
        super(rolesDbContext);
    }
}