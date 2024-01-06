import mongoose, { Schema, Types } from "mongoose";
import { IEntity } from "./entity.types";


export enum QUEUE_STATUS {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    PAUSED = 'PAUSED',
  }
  
export interface IQueque extends IEntity
{
    userId: string;
    sessionId: string;
    quequeTitle: string;
    quequeMessage: string;
    status: string;
    startDate: Date;
}
export const quequeSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    sessionId: {
        type:String,
        required: true,
    },
    quequeTitle: {
        type: String,
        required: true,
    },
    quequeMessage: {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    startDate: {
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

});