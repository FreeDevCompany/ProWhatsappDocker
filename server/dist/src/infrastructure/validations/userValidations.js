"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionBody = exports.deleteSessionParam = exports.deleteAccountParam = exports.reactivateAccountConfirmParam = exports.reactivteAccountParam = exports.deleteAccountBody = exports.freezeAccountBody = exports.freezeAccountParam = exports.activeSessionsQuery = exports.activeSessionsParam = exports.updateAutomationSettings = exports.getAutomationSettingsParam = exports.updateProfileBody = exports.updateProfileParam = exports.forgotPasswordParam = exports.forgotPasswordLinkParam = exports.forgotPasswordConfirmBody = exports.resetSessionBod = exports.forgotPasswordLinkBody = exports.verifyEmailQuery = exports.resetPasswordBody = exports.loginBody = exports.signUpBody = void 0;
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
    user: joi_1.default.string().required(),
});
exports.forgotPasswordConfirmBody = joi_1.default.object({
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
exports.forgotPasswordLinkParam = joi_1.default.object({
    userId: joi_1.default.string().required(),
});
exports.forgotPasswordParam = joi_1.default.object({
    token: joi_1.default.string().required(),
});
exports.updateProfileParam = joi_1.default.object({
    user: joi_1.default.string().required(),
});
exports.updateProfileBody = joi_1.default.object({
    avatar: joi_1.default.string().required().regex(/^data:image\/(jpeg|png|jpg);base64,/),
    firstName: joi_1.default.string().required().min(3).max(30),
    lastName: joi_1.default.string().required().min(3).max(30),
});
exports.getAutomationSettingsParam = joi_1.default.object({
    user: joi_1.default.string().required()
});
exports.updateAutomationSettings = joi_1.default.object({
    beginTime: joi_1.default.date().required(),
    min_message_delay: joi_1.default.number().required(),
    max_message_delay: joi_1.default.number().required()
});
exports.activeSessionsParam = joi_1.default.object({
    user: joi_1.default.string().required()
});
exports.activeSessionsQuery = joi_1.default.object({
    page: joi_1.default.number().required(),
    perpage: joi_1.default.number().required()
});
exports.freezeAccountParam = joi_1.default.object({
    user: joi_1.default.string().required()
});
exports.freezeAccountBody = joi_1.default.object({
    password: joi_1.default.string().required()
});
exports.deleteAccountBody = joi_1.default.object({
    password: joi_1.default.string().required()
});
exports.reactivteAccountParam = joi_1.default.object({
    user: joi_1.default.string().required()
});
exports.reactivateAccountConfirmParam = joi_1.default.object({
    user: joi_1.default.string().required(),
    code: joi_1.default.string().required(),
});
exports.deleteAccountParam = joi_1.default.object({
    user: joi_1.default.string().required()
});
exports.deleteSessionParam = joi_1.default.object({
    user: joi_1.default.string().required(),
});
exports.deleteSessionBody = joi_1.default.object({
    password: joi_1.default.string().required(),
    session: joi_1.default.string().required()
});
//# sourceMappingURL=userValidations.js.map