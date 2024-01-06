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
            let mailService = mailProvider_class_1.GmailSender.getInstance();
            let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
                'http://localhost:3000';
            yield mailService.sendMail({
                provider: "test@gmail.com",
                from: "Pro-Whats-App-WEB Service",
                subject: "Email verification",
                text: `${baseLink}/auth/${id}/verify-email/${encodeURIComponent(hash)}`,
                to: to
            });
        });
    }
    static SendActivationLink(to, id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
                'http://localhost:3000';
            let mailService = mailProvider_class_1.GmailSender.getInstance();
            yield mailService.sendMail({
                provider: "test@gmail.com",
                from: "Pro-Whats-App-WEB Service",
                subject: "Reactivation Code",
                text: `${baseLink}/auth/${id}/account/reactivate-account/${encodeURIComponent(code)}`,
                to: to
            });
        });
    }
    static SendForgotPasswordLink(to, id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let mailService = mailProvider_class_1.GmailSender.getInstance();
            let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
                'http://localhost:3000';
            'http://localhost:3011';
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
    static GeneratePaginateLink(userId, listLabel, totalPage, page, perPage) {
        let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
            'http://localhost:3000';
        var links = [];
        for (var i = 0; i < totalPage; i++) {
            let linkIndex = {
                active: page == i + 1 ? true : false,
                label: (i + 1).toString(),
                page: i + 1,
                url: `${baseLink}/${userId}/${listLabel}?page=${i + 1}&perpage=${perPage}`
            };
            links.push(linkIndex);
        }
        return links;
    }
}
exports.LinkHelper = LinkHelper;
LinkHelper.config = {};
//# sourceMappingURL=linkHelper.js.map