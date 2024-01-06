import { Schema, Types } from "mongoose";
import { IEntity } from "./entity.types";


export interface IExtraNumber extends IEntity
{
    userId: Types.ObjectId;
    phone: string;
}

export const extraNumberSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    phone: {
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