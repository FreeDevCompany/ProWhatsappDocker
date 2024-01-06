import mongoose, { Document, Schema } from "mongoose";
import { IEntity } from "./entity.types";

export interface IRole extends IEntity {
    roleName: string,

}

export const roleSchema = new Schema({
    roleName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        required: false,
        default: new Date() 
    }

})

export const createDefaultRoles = async () => {
    try {
        const existsRoleData = await mongoose.model('Role', roleSchema).find();
        if (existsRoleData.length > 0) return;
        const defaultRoles: Array<IRole> = [
            {
                roleName: "Root",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleName: "Admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                roleName: "User",
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];
        await mongoose.model('Role', roleSchema).create(defaultRoles);
    } 
    catch (error) {
        console.log(`MIGRATION ERROR | ${error.message}`);
    }
}