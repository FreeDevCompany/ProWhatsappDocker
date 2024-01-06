import { Schema } from "mongoose";
import { IEntity } from "./entity.types";


export interface ICustomer extends IEntity {
    userId: string;
    groupId?: string;
    name: string;
    lastName: string;
    phone: string;
    registeredBlackList: boolean;
    registeredGrayList: boolean;
}
export interface ICustomerResponse {
    id: string;
    groupId?: string;
    name: string;
    lastName:string;
    phone: string;
}
export const customerSchema = new Schema({
    userId: {
        required: true,
        type: String,
    },
    groupId: {
        required: false,
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    registeredBlackList: {
        required: false,
        type: Boolean,
        default: false,
    },
    registeredGrayList:{
        required: false,
        type: Boolean,
        default: false,
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