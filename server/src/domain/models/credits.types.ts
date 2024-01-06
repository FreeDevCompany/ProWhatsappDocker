import { Schema, Types } from "mongoose";
import { IEntity } from "./entity.types";


export interface ICredit extends IEntity
{
    userId: Types.ObjectId;
    totalAmount: number;
}
export const creditSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    totalAmount: {
        type: Number,
        required: true
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