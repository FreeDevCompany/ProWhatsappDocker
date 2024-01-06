import { GmailSender } from "../../infrastructure/services/mailProvider.class";
import { HashHelper } from "./hashHelper";

export class LinkHelper {
  static config: {
    from?: string,
    subject?: string,
    text?: string
  } = {};
  static async SendVerifyEmail(to: string, id: string) {
    let hash = await HashHelper.encrypt(`${to}${id}`);
    let mailService = GmailSender.getInstance();
    let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
      'http://localhost:3000';
    await mailService.sendMail({
      provider: "test@gmail.com",
      from: "Pro-Whats-App-WEB Service",
      subject: "Email verification",
      text: `${baseLink}/auth/${id as unknown as string}/verify-email/${encodeURIComponent(hash)}`,
      to: to
    });
  }
  static async SendActivationLink(to: string, id: string, code: string) {
    let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
    'http://localhost:3000';    let mailService = GmailSender.getInstance();
    await mailService.sendMail({
      provider: "test@gmail.com",
      from: "Pro-Whats-App-WEB Service",
      subject: "Reactivation Code",
      text: `${baseLink}/auth/${id as unknown as string}/account/reactivate-account/${encodeURIComponent(code)}`,
      to: to
    });
  }
  static async SendForgotPasswordLink(to: string, id: string, token: string) {
    let mailService = GmailSender.getInstance();
    let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
    'http://localhost:3000';      'http://localhost:3011';
    let link = `${baseLink}/auth/forgot-password-confirm/${encodeURIComponent(token)}`;
    await mailService.sendMail({
      provider: "test@gmail.com",
      from: "Pro-Whats-App-WEB Service",
      subject: "Forgot Password",
      text: link,
      to: to
    });
  }
  static GeneratePaginateLink(userId: string, listLabel: string, totalPage: number, page: number, perPage: number): Array<{ label: string; active: boolean; url: string | null; page: number | null }> {
    let baseLink = process.env.NODE_ENV === 'PRODUCTION' ? process.env.WEB_URL :
    'http://localhost:3000';    var links: Array<{ label: string; active: boolean; url: string | null; page: number | null }> = [];
    for (var i = 0; i < totalPage; i++) {
      let linkIndex: { label: string; active: boolean; url: string | null; page: number | null } = {
        active: page == i + 1 ? true : false,
        label: (i + 1).toString(),
        page: i + 1 as number,
        url: `${baseLink}/${userId}/${listLabel}?page=${i + 1}&perpage=${perPage}`
      }
      links.push(linkIndex);
    }
    return links;
  }
}
