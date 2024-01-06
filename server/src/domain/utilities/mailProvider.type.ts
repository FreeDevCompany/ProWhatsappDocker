export interface IMailOptions {
    provider: string // gmail or hotmail 
    from: string;
    to: string;
    subject: string;
    text: string;
    cc?: string;
    bcc?: string;
    html?: string;
}

export interface IMailSender<T extends IMailOptions> {
    createLocalConnection: () => Promise<Boolean>;
    createLiveConnection: () => Promise<Boolean>;
    sendMail: (mailData: T) => Promise<Boolean>;
    verifyConnection: () => Promise<boolean>;
}