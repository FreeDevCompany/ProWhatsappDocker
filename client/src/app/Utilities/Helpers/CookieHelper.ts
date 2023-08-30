import { getCookie, setCookie, removeCookie } from "typescript-cookie"
export class CookieHelper {
    static AddItem (cookie_name: string, item: string, expire_date: Date)
    {
        setCookie(cookie_name, item, {expires: expire_date, domain: "mydomain.com"})
    }

    static DeleteItem(cookie_name: string)
    {
        removeCookie(cookie_name, {domain: "mydomain.com"});
    }

    static CheckCredentials(token_name: string, user_name: string, role_name: string)
    {
        let token = getCookie(token_name);
        let user = getCookie(user_name);
        let role = getCookie(role_name);
        return token && user && role;
    }

    static GetCookieData(item_name) {
        return getCookie(item_name);
    }
}