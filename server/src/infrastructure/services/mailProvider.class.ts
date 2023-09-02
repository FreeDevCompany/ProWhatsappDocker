import SMTPTransport from "nodemailer/lib/smtp-transport";
import { IMailSender } from "../../domain/utilities/mailProvider.type";
import { IMailOptions } from "../../domain/utilities/mailProvider.type";
import * as nodemailer from 'nodemailer';

export class GmailSender implements IMailSender<IMailOptions>
{
    private static instance: GmailSender;
    private transporter: nodemailer.Transporter;


    private constructor() { }

    static getInstance() {
        if (!GmailSender.instance)
            GmailSender.instance = new GmailSender();
        return GmailSender.instance;
    }

    createLocalConnection = async (): Promise<Boolean> => {
        try 
        {    
            let account = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,

                }
            })
            return true;
        }
        catch (e) {
            console.log(e)
            return false;
        }
    };
    createLiveConnection = async (): Promise<Boolean> => {
        // try 
        // {
        //     this.transporter = nodemailer.createTransport({
        //         host: process.env.SMTP_CONFIG_HOST,
        //         port: process.env.SMTP_CONFIG_PORT,
        //         secure: process.env.SMTP_CONFIG_TLS === 'yes' ? true : false,
        //         auth: {
        //             user: process.env.SMTP_CONFIG_USERNAME,
        //             pass: process.env.SMTP_CONFIG_PASSWORD,

        //         }
        //     })
        //     return true;
        // }
        // catch (e) {
        //     console.log(e)
        //     return false;
        // }
        return false;
    };
    sendMail = async(mailData: IMailOptions): Promise<Boolean> => {
        return await this.transporter
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
                console.log(info)
                return true;
            }).catch((error) => {return false});
    };
    verifyConnection = async(): Promise<boolean> => {
        return this.transporter.verify();
    };
}