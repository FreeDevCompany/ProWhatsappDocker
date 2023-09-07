"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
;
exports.userSchema = new mongoose_1.Schema({
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
        default: new Date()
    },
    updated_at: {
        required: false,
        type: Date,
        default: new Date(),
    },
});
//# sourceMappingURL=user.types.js.map