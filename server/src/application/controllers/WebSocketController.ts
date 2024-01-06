import { Socket } from "socket.io";
import { RepositoryService } from "../../infrastructure/services/repositoryService.class";
import { inject, injectable } from "inversify";
import { Types } from "../../domain/models/ioc.types";
import { LogLocation, LogType, LoggerService } from "../../infrastructure/services/loggerService.class";
import { WhatsappService } from "../../infrastructure/services/whatsappService";
import * as WpSocketLib from "@whiskeysockets/baileys";
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { MongoClient } from "mongodb";
import globalConfig from "../../domain/logic/config";
import { Boom } from "@hapi/boom"
import mongoose from "mongoose";
import { wpSessionCollection } from "../../domain/models/wpSession.types";
import { ExistsResponse } from "@whiskeysockets/baileys/lib/Socket/registration";
@injectable()
export class WebSocketController {
  private WpService: WhatsappService;
  private WpSocket: (typeof WpSocketLib.default)
  private repositoryService: RepositoryService;
  private loggerService: LoggerService;

  constructor(
    @inject("RepositoryService") repositoryService: RepositoryService,
    @inject(Types.WhatsappService) WpService: WhatsappService,
    @inject(Types.LoggerService) _loggerService: LoggerService) {
    this.repositoryService = repositoryService;
    this.loggerService = _loggerService;
    this.WpService = WpService;
  }
  
  //ssactivity namespace (user activity namespace)
  userActivitySocket = (socket: Socket) => {

    socket.on('disconnect', (data) => {
      //must coding this part
    })
  }

  getQrCode = async(socket:Socket) => {
    this.loggerService.Log(LogType.INFO, LogLocation.console, "Running QR CODE SOCKET");
    socket.on("getQrCode", async(data) => {
      if (data.id && data.phone)
      {
        const connectWhatsApp = async() => {
          this.loggerService.Log(LogType.INFO, LogLocation.console, "Try to connect whats app");
          const { state, saveCreds } = await this.WpService.useMongoDBAuthState(wpSessionCollection, `${data.id}:${data.phone}`);
          const sock = makeWASocket({
            printQRInTerminal: true,
            auth: state,
            syncFullHistory: false,
            browser: WpSocketLib.Browsers.ubuntu("Desktop"),
            keepAliveIntervalMs: 10000
          });
          sock.ev.on('connection.update', async({ connection, lastDisconnect, qr, isOnline, isNewLogin, receivedPendingNotifications }) => {
            const lastDisonnect = lastDisconnect as any;
            if (qr)
            {
              socket.emit("sendQrCode", {qr: qr})
            }
            const status = lastDisonnect?.error?.output?.statusCode
            if (connection === 'close'){
                const reason = Object.entries(DisconnectReason).find(i => i[1] === status)?.[0] || 'unknown'
        
                console.log(`Closed connection, status: ${reason} (${status})`)
        
                if (status !== 403 && status !== 401){
                  connectWhatsApp()
                }
            } 
            else if (connection === 'open'){
              this.loggerService.Log(LogType.INFO, LogLocation.console, "Opened connection");
              socket.emit("connection-success", {message: "Successfully connected"});
              if (!status)
              {
                socket._cleanup();
                sock.ev.removeAllListeners("connection.update");
                sock.ev.removeAllListeners("creds.update");
                sock.ev.removeAllListeners("presence.update");
                sock.end(null);
                socket._cleanup();
                socket.disconnect();
              }
            }
          })
          sock.ev.on("creds.update", async() => {
            const saved = await saveCreds();
            if (saved === null)
              {
                socket.emit("WrongNumber", {message: "You can't use the different device from your system phones"});
              }
              else 
              {

              }
          })
        }
        connectWhatsApp();
      }
    })

  }

  //wp-configuration namespace (socket namespace)

}
