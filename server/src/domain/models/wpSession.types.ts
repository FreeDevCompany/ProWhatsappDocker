import { MongoClient } from "mongodb";
import globalConfig from "../logic/config";

const mongoClient = new MongoClient(globalConfig.mongo);
export const wpSessionCollection = mongoClient
    .db("proWhatsApp")
    .collection("whatsappsessions");
// burada qr kod gönderilecek. (bu fonksiyon sadece connection anında bir kere tetikleniyor ve client'a qr kodu gönderme işlemini yapıyor);
// wpclient;