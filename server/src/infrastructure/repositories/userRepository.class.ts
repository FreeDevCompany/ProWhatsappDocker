import { RepositoryBase } from "./repository.abstract";
import { IUserDto } from '../../domain/models/user.types';
import { inject, injectable, named } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { IDbContext } from "../../domain/repositories/dbContext.types";
import {  Types as mongoType } from "mongoose";
import 'reflect-metadata';
@injectable()
export class UserRepository extends RepositoryBase<IUserDto>
{
    constructor(@inject(Types.IDbContext) @named("userDbContext") userDbContext: IDbContext<IUserDto>) {
        super(userDbContext);
    }

    findUserWithToken = async (token: string): Promise<IUserDto> => {
        return await this.findOne({ 'activeSession.token': token });
    }

    createUser = async (
        avatar: string,
        firstName: string,
        lastName: string,
        phone: string,
        email: string,
        password: string,
        extraNumberCount: number,
        roleId: mongoType.ObjectId) => {
        return await this.create({
            avatar: avatar,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            password: password,
            extraNumberCount: extraNumberCount,
            verified: false,
            roleId: roleId
        })
    }

    getAllDataWithPopulate = async (rolerefName: string, rolModelName: string,id?: string, email?: string) => {
        if (id && !email) {
            return (await this.dbContext.model.findById(id).populate({
                path: rolerefName, model: rolModelName, options: {
                    strictPopulate: false
                }
            }).exec());
        }

        if (email && !id) {
            return await this.dbContext.model.findOne({ email: email }).populate({
                path: rolerefName, model: rolModelName, options: {
                    strictPopulate: false
                }
            }).exec();
        }
    }
}