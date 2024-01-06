import { Schema } from "mongoose";
import { IEntity } from "./entity.types";


export interface ICreditTransaction extends IEntity {
    user_id: string;
    transaction_type: 'spent' | 'upload';
    amount: number;
    transaction_date: Date;
}

export const creditTransactionSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    transaction_type: {
        type: String,
        enum: ['spent', 'upload'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transaction_date: {
        type: Date,
        required: false,
        default: new Date()
    }
})
