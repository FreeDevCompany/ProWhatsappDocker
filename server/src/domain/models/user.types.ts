import { Schema, Types } from "mongoose";
import { IEntity } from "./entity.types";


export interface IUserDto extends IEntity {
  avatar: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  email_hash?: string;
  password: string;
  roleId: Types.ObjectId;
  verified?: boolean;
  frozenAccount?: Boolean;
  frozenAccountCode?: string;
  extraNumberCount: Number;
}
export const userSchema = new Schema({
  avatar: {
    required: true,
    type: String
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  email_hash: {
    required: false,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  roleId: {
    required: true,
    type: Types.ObjectId,
    ref: 'Role',
  },

  verified: {
    required: false,
    type: Boolean,
    default: false,
  },
  frozenAccount: {
    required: false,
    type: Boolean,
    default: false
  },
  frozenAccountCode: {
    required: false,
    type: String,
    default: ""
  },
  extraNumberCount: {
    required: true,
    type: Number,
  },
  created_at: {
    required: false,
    type: Date,
    default: new Date()
  },
  updated_at: {
    required: false,
    type: Date,
    default: new Date(),
  },
})
