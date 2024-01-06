import mongoose from "mongoose";
import { HashHelper } from "./hashHelper";
import { ObjectId } from "mongodb";


export class SessionHelper {

    static generateSessionToken = async (userId: string, deviceId: string): Promise<{ token: string, expireDate: Date }> => {
        let data = userId as unknown as string + deviceId;
        let token = await HashHelper.encrypt(data);
        let now = new Date();
        const expireDate = new Date(now.getTime() + 60 * 60 * 1000);
        return {
            token: token,
            expireDate: expireDate
        }
    }

}