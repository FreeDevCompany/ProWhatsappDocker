"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileBody = exports.updateProfileParam = exports.forgotPasswordConfirmQuery = exports.forgotPasswordLinkParam = exports.forgotPasswordConfirmBody = exports.resetSessionBod = exports.forgotPasswordLinkBody = exports.verifyEmailQuery = exports.resetPasswordBody = exports.loginBody = exports.signUpBody = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signUpBody = joi_1.default.object({
    avatar: joi_1.default.string().required(),
    firstName: joi_1.default.string().required().min(3).max(30),
    lastName: joi_1.default.string().required().min(3).max(30),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    phone: joi_1.default.string().required().min(11).max(14),
});
exports.loginBody = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.resetPasswordBody = joi_1.default.object({
    id: joi_1.default.string().required(),
    currentPassword: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    newPassword: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.verifyEmailQuery = joi_1.default.object({
    hash: joi_1.default.string().required()
});
exports.forgotPasswordLinkBody = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.resetSessionBod = joi_1.default.object({
    id: joi_1.default.string().required(),
});
exports.forgotPasswordConfirmBody = joi_1.default.object({
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.forgotPasswordLinkParam = joi_1.default.object({
    userId: joi_1.default.string().required(),
});
exports.forgotPasswordConfirmQuery = joi_1.default.object({
    token: joi_1.default.string().required(),
});
exports.updateProfileParam = joi_1.default.object({
    userId: joi_1.default.string().required(),
});
exports.updateProfileBody = joi_1.default.object({
    avatar: joi_1.default.string().required().regex(/^data:image\/(jpeg|png|gif);base64,/),
    firstName: joi_1.default.string().required().min(3).max(30),
    lastName: joi_1.default.string().required().min(3).max(30),
});
//# sourceMappingURL=userValidations.js.map