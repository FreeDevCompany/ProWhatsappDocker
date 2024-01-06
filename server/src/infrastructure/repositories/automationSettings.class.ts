import { inject, injectable, named } from "inversify";
import { IAutomationSettings } from "../../domain/models/autoMationSettings.types";
import { RepositoryBase } from "./repository.abstract";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { Types } from "../../domain/models/ioc.types";
import 'reflect-metadata';

@injectable()
export class AutomationSettingsRepository extends RepositoryBase<IAutomationSettings>
{
    constructor(@inject(Types.IDbContext) @named("automationDbContext") automationDbContext: IDbContext<IAutomationSettings>)
    {
        super(automationDbContext);
    }
}