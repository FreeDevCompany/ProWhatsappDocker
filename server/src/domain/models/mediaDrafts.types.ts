import { Schema } from "mongoose";
import { IEntity } from "./entity.types";


export interface IMediaDraft extends IEntity{
    userId: string;
    originalName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
}

export const mediaSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true 
    },
    fileType: {
        type: String,
        required: true,
    },
    fileSize: {
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
})