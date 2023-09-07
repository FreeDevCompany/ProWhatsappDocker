"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const singleton_type_1 = require("../../domain/utilities/singleton.type");
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
        let privateKey = process.env.JWT_SECRET_KEY;
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
        let privateKey = process.env.JWT_SECRET_KEY;
        return jsonwebtoken_1.default.verify(token, privateKey, verifyOptions);
    }
}
exports.jwtHandler = singleton_type_1.SingletonFactory.createInstance(JwtHandler);
//# sourceMappingURL=jwtHandler.class.js.map