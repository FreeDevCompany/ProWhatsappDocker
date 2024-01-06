import { Schema } from "mongoose";
import { IEntity } from "./entity.types";

export interface ICustomerGroup extends IEntity{
    userId: string;
    groupName: string;
}

export const customerGroupSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    groupName: {
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