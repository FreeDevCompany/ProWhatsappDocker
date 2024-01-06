import mongoose, { Schema, Types } from "mongoose";
import { IEntity } from "./entity.types";


export interface IQuequeItem extends IEntity
{
    quequeId: string;
    customerId: string;
    spendCredit?: boolean;
    message_status?: string;
}
export const quequeItemSchema = new Schema({
    quequeId: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    spendCredit: {
        type: Number,
        required: false,
        default: false,
    },
    message_status: {
        type: String,
        required: false,
        default: ""
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
});
