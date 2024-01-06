import dotenv from 'dotenv';
import * as path from 'path';
import * as os from 'os';
dotenv.config()

const fileLimit = {
    fileSize: 10 * 1024 * 1024
}
const globalConfig = {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo: process.env.MONGO_URL,
    webUrl: process.env.WEB_URL,
    filePath: process.env.FILE_UPLOAD_PATH,
    baseOsPath: path.parse(os.homedir()).root,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    jwt: process.env.JWT_SECRET_KEY,
    gateway: process.env.GATEWAY_SECRET_KEY,
    smtpConfig: {
        host:  process.env.SMTP_CONFIG_HOST,
        port: process.env.SMTP_CONFIG_PORT,
        tls: process.env.SMTP_CONFIG_TLS,
        username: process.env.SMTP_CONFIG_USERNAME,
        password: process.env.SMTP_CONFIG_PASSWORD,
    }
}
export {fileLimit};
export default globalConfig;