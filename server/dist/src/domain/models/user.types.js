<<<<<<< HEAD:server/dist/src/domain/models/user.types.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
;
exports.userSchema = new mongoose_1.Schema({
    avatar: {
        required: true,
        type: String
=======
import mongoose, { Schema, model } from "mongoose";
import { IEntity } from "./entity.types";
import { HashHelper } from "../../application/utilities/hashHelper";


export interface IUserDto extends IEntity{
    avatar: Buffer;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    email_hash?: string;
    password: string;
    roleId: string;
    verified?: boolean;
    extraNumberCount: Number;
    activeSession?: {
        token: string;
        expireDate: Date,
    };
    created_at?: Date;
    updated_at?: Date;
}
interface IUserDocument extends Document, IUserDto {
}; 
export const userSchema = new Schema({
    avatar: {
        required: true,
        type: Buffer
>>>>>>> 3ef848e60501be5bc406b3e36ab0c375b7b72df3:server/src/domain/models/user.types.ts
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
        type: String,
    },

    verified: {
        required: false,
        type: Boolean,
        default: false,
    },
    extraNumberCount: {
        required: true,
        type: Number,
    },
    activeSession: {
        required: false,
        type: {
            token: {
                required: true,
                type: String,
            },
            expireDate: {
                required: true,
                type: Date
            },
        }
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
<<<<<<< HEAD:server/dist/src/domain/models/user.types.js
});
//# sourceMappingURL=user.types.js.map
=======
})
userSchema.pre('save', async function(this:any, next) {
    if(!this.isModified('password')) next();
    this.password = await HashHelper.encrypt(this.password);
})
>>>>>>> 3ef848e60501be5bc406b3e36ab0c375b7b72df3:server/src/domain/models/user.types.ts
