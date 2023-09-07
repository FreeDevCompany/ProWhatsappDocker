import { RepositoryBase } from "./repository.abstract";
import {IUserDto} from '../../domain/models/user.types';
import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";

@injectable()
export class UserRepository extends RepositoryBase<IUserDto> 
{
    constructor(@inject(Types.IDbContext) dbContext: IDbContext<IUserDto>)
    {
        super(dbContext);
    }

    findUserWithToken = async(token: string): Promise<IUserDto> => {
        return await this.findOne({'activeSession.token': token});
    }
}