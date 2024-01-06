import { Schema, Types } from "mongoose";
import { IEntity } from "./entity.types";


export interface IAutomationSettings extends IEntity {
    userId: Types.ObjectId;
    min_message_delay: number;
    max_message_delay: number;
    beginTime: Date;
}


export const automationSettingsSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    min_message_delay: {
        type: Number,
        required: true,
        default: 0
    },
    max_message_delay: {
        type: Number,
        required: true,
        default: 5,
    },
    beginTime: {
        type: Date,
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