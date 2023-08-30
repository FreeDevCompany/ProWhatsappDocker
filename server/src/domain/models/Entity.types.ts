import { Document, Types } from "mongoose";

export interface IEntity extends Document
{
    _id: Types.ObjectId;
}