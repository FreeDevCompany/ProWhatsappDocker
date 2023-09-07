"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionHelper = void 0;
const hashHelper_1 = require("./hashHelper");
class SessionHelper {
}
exports.SessionHelper = SessionHelper;
_a = SessionHelper;
SessionHelper.generateSessionToken = (userId, deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    let data = userId + deviceId;
    let token = yield hashHelper_1.HashHelper.encrypt(data);
    let now = new Date();
    const expireDate = new Date(now.getTime() + 60 * 60 * 1000);
    return {
        token: token,
        expireDate: expireDate
    };
});
//# sourceMappingURL=sessionHelper.js.map