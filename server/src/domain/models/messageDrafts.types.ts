import { Schema } from "mongoose";
import { IEntity } from "./entity.types";


export interface IMessageDraft extends IEntity{
    userId: string;
    title: string;
    text: string;

}

export const messageSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,

    },
    text: {
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