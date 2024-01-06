import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { Types } from "../../domain/models/ioc.types";
import 'reflect-metadata';
import { IMessageDraft } from "../../domain/models/messageDrafts.types";

@injectable()
export class MessageDraftRepository extends RepositoryBase<IMessageDraft>
{
    constructor(@inject(Types.IDbContext) @named("messageDraftDbContext") messageDraftContext: IDbContext<IMessageDraft>)
    {
        super(messageDraftContext);
    }
}