"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const singleton_type_1 = require("../../domain/utilities/singleton.type");
const config_1 = __importDefault(require("../../domain/logic/config"));
class JwtHandler {
    signNewToken(data, expire = '1h') {
        var verifyOptions = {
            issuer: "i",
            subject: "s",
            audience: "a",
            expiresIn: expire,
            notBefore: "0",
            algorithm: 'HS256'
        };
        let privateKey = config_1.default.jwt;
        var token = jsonwebtoken_1.default.sign(data, privateKey, verifyOptions);
        return token;
    }
    verifyToken(token) {
        var verifyOptions = {
            issuer: "i",
            subject: "s",
            audience: "a",
            expiresIn: "1h",
            notBefore: "0",
            algorithm: 'HS256'
        };
        let privateKey = config_1.default.jwt;
        return jsonwebtoken_1.default.verify(token, privateKey, verifyOptions);
    }
}
exports.jwtHandler = singleton_type_1.SingletonFactory.createInstance(JwtHandler);
//# sourceMappingURL=jwtHandler.class.js.map