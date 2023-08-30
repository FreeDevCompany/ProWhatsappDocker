import mongoose, { Schema } from "mongoose";


interface IUser {
    username: string;
    phone: string;
    email: string;
    password: string;
    roleId: string;
    verified?: boolean;
    extraNumberCount: Number;
    created_at?: Date;
    updated_at?: Date;
}
const userSchema = new Schema<IUser>({
    username: {
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
    created_at: {
        required: false,
        type: Date,
        default: new Date(),
    },
    updated_at: {
        required: false,
        type: Date,
        default: new Date(),
    },
})
const UserModel = mongoose.model<IUser>('User', userSchema);