import { inject, injectable, named } from "inversify";
import { RepositoryBase } from "./repository.abstract";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import { Types } from "../../domain/models/ioc.types";
import 'reflect-metadata';
import { IMediaDraft } from "../../domain/models/mediaDrafts.types";

@injectable()
export class MediaDraftRepository extends RepositoryBase<IMediaDraft>
{
    constructor(@inject(Types.IDbContext) @named("mediaDraftDbContext") mediaDraftContext: IDbContext<IMediaDraft>)
    {
        super(mediaDraftContext);
    }

}