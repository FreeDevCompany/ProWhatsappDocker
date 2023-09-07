"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseHeaderWithDeviceId = exports.baseHeaderWithToken = exports.baseHeader = void 0;
const joi_1 = __importDefault(require("joi"));
const baseHeader = joi_1.default.object({
    'content-length': joi_1.default.string(),
    'connection': joi_1.default.string(),
    'accept-encoding': joi_1.default.string(),
    'host': joi_1.default.string().required(),
    'postman-token': joi_1.default.string(),
    'accept': joi_1.default.string(),
    'user-agent': joi_1.default.string(),
    'content-type': joi_1.default.string(),
    'x-api-gateway': joi_1.default.string().required(),
}).unknown(true);
exports.baseHeader = baseHeader;
const baseHeaderWithDeviceId = joi_1.default.object({
    'content-length': joi_1.default.string(),
    'connection': joi_1.default.string(),
    'accept-encoding': joi_1.default.string(),
    'host': joi_1.default.string().required(),
    'postman-token': joi_1.default.string(),
    'accept': joi_1.default.string(),
    'user-agent': joi_1.default.string(),
    'content-type': joi_1.default.string(),
    'x-api-gateway': joi_1.default.string().required(),
    'x-device-id': joi_1.default.string().required()
}).unknown(true);
exports.baseHeaderWithDeviceId = baseHeaderWithDeviceId;
const baseHeaderWithToken = joi_1.default.object({
    'content-length': joi_1.default.string(),
    'connection': joi_1.default.string(),
    'accept-encoding': joi_1.default.string(),
    'host': joi_1.default.string().required(),
    'postman-token': joi_1.default.string(),
    'accept': joi_1.default.string(),
    'user-agent': joi_1.default.string(),
    'content-type': joi_1.default.string(),
    'x-api-gateway': joi_1.default.string().required(),
    'x-token': joi_1.default.string().required()
}).unknown(true);
exports.baseHeaderWithToken = baseHeaderWithToken;
//# sourceMappingURL=headerValidations.js.map