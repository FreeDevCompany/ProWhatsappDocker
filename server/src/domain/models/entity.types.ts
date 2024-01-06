import { Document, Types } from "mongoose";

export interface IEntity
{
    _id?: Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}