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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkHelper = void 0;
const mailProvider_class_1 = require("../../infrastructure/services/mailProvider.class");
const hashHelper_1 = require("./hashHelper");
class LinkHelper {
    static SendVerifyEmail(to, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let hash = yield hashHelper_1.HashHelper.encrypt(`${to}${id}`);
            console.log(hash);
            let mailService = mailProvider_class_1.GmailSender.getInstance();
            let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
                'http:localhost:3011';
            yield mailService.sendMail({
                provider: "test@gmail.com",
                from: "Pro-Whats-App-WEB Service",
                subject: "Email verification",
                text: `${baseLink}/auth/${id}/verify-email/${encodeURIComponent(hash)}`,
                to: to
            });
        });
    }
    static SendForgotPasswordLink(to, id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let mailService = mailProvider_class_1.GmailSender.getInstance();
            let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
                'http:localhost:3011';
            let link = `${baseLink}/auth/forgot-password-confirm/${encodeURIComponent(token)}`;
            yield mailService.sendMail({
                provider: "test@gmail.com",
                from: "Pro-Whats-App-WEB Service",
                subject: "Forgot Password",
                text: link,
                to: to
            });
        });
    }
}
exports.LinkHelper = LinkHelper;
LinkHelper.config = {};
//# sourceMappingURL=linkHelper.js.map