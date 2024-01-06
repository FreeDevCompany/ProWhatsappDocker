import { randomBytes } from "crypto";
import {
    Curve,
    signedKeyPair,
} from "@whiskeysockets/baileys/lib/Utils/crypto";
import { proto } from "@whiskeysockets/baileys/WAProto";
import {
    generateRegistrationId
} from "@whiskeysockets/baileys/lib/Utils/generics";
import { injectable } from "inversify";

const initAuthCreds = () => {
    const identityKey = Curve.generateKeyPair();
    return {
        noiseKey: Curve.generateKeyPair(),
        signedIdentityKey: identityKey,
        signedPreKey: signedKeyPair(identityKey, 1),
        registrationId: generateRegistrationId(),
        advSecretKey: randomBytes(32).toString("base64"),
        processedHistoryMessages: [],
        nextPreKeyId: 1,
        firstUnuploadedPreKeyId: 1,
        accountSettings: {
            unarchiveChats: false,
        },
    };
};

const BufferJSON = {
    replacer: (k, value) => {
        if (
            Buffer.isBuffer(value) ||
            value instanceof Uint8Array ||
            value?.type === "Buffer"
        ) {
            return {
                type: "Buffer",
                data: Buffer.from(value?.data || value).toString("base64"),
            };
        }

        return value;
    },

    reviver: (_, value) => {
        if (
            typeof value === "object" &&
            !!value &&
            (value.buffer === true || value.type === "Buffer")
        ) {
            const val = value.data || value.value;
            return typeof val === "string"
                ? Buffer.from(val, "base64")
                : Buffer.from(val || []);
        }

        return value;
    },
};

@injectable()
export class WhatsappService {
    private collection: any;
    public currentId: string;
    readData = async (id) => {
        try {
            const data = JSON.stringify(await this.collection.findOne({ _id: id }));
            return JSON.parse(data, BufferJSON.reviver);
        } catch (error) {
            return null;
        }
    };
    writeData = async (data, id) => {
        try {
            const informationToStore = JSON.parse(
                JSON.stringify(data, BufferJSON.replacer)

            );
            const update = {
                $set: {
                    ...informationToStore,
                },
            };
            if (data.me.id.split(':')[0] === id.split(':')[1]) {
                const updated = await this.collection.updateOne({ _id: id }, update, { upsert: true });
                return updated;
            }
            else
                return null;

        }
        catch (err) {
            throw err;
        }
    };
    removeData = async (id) => {
        try {
            await this.collection.deleteOne({ _id: id });
        } catch (_a) {
        }
    };
    useMongoDBAuthState = async (collection, userId) => {
        try {
            this.collection = collection;
            this.currentId = userId;
            // @ts-ignore
            const creds = (await this.readData(this.currentId)) || (0, initAuthCreds)();
            const data = {
                state: {
                    creds,
                    keys: {
                        get: async (type, ids) => {
                            const data = {};
                            await Promise.all(
                                ids.map(async (id) => {
                                    let value = await this.readData(`${type}-${id}`);
                                    if (type === "app-state-sync-key") {
                                        value = proto.Message.AppStateSyncKeyData.fromObject(data);
                                    }
                                    data[id] = value;
                                })
                            );
                            return data;
                        },
                        set: async (data) => {
                            const tasks = [];
                            for (const category of Object.keys(data)) {
                                for (const id of Object.keys(data[category])) {
                                    const value = data[category][id];
                                    const key = `${category}-${id}`;
                                    tasks.push(value ? this.writeData(value, key) : this.removeData(key));
                                }
                            }
                            await Promise.all(tasks);
                        },
                    },
                },
                saveCreds: () => {
                    return this.writeData(creds, this.currentId);
                },
            }
            return data;
        }
        catch(err)
        {
            console.log("ERROR:", err);
        }
    }
    
}