"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.GmailSender = void 0;
const nodemailer = __importStar(require("nodemailer"));
class GmailSender {
    constructor() {
        this.createLocalConnection = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass,
                    }
                });
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.createLiveConnection = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.SMTP_CONFIG_USERNAME,
                        pass: process.env.SMTP_CONFIG_PASSWORD
                    }
                });
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
            return false;
        });
        this.sendMail = (mailData) => __awaiter(this, void 0, void 0, function* () {
            return yield this.transporter
                .sendMail({
                from: `"chiragmehta900" ${mailData.from}`,
                to: mailData.to,
                cc: mailData.cc,
                bcc: mailData.bcc,
                subject: mailData.subject,
                text: mailData.text,
                html: mailData.html,
            })
                .then((info) => {
                console.log(info);
                return true;
            }).catch((error) => {
                console.log(error);
                return false;
            });
        });
        this.verifyConnection = () => __awaiter(this, void 0, void 0, function* () {
            return this.transporter.verify();
        });
    }
    static getInstance() {
        if (!GmailSender.instance)
            GmailSender.instance = new GmailSender();
        return GmailSender.instance;
    }
}
exports.GmailSender = GmailSender;
//# sourceMappingURL=mailProvider.class.js.map