import jwt from 'jsonwebtoken';
import { SingletonFactory } from '../../domain/utilities/singleton.type';
import globalConfig from '../../domain/logic/config';
class JwtHandler {
    signNewToken(data: object, expire:string='1h'): string {
        var verifyOptions = {
            issuer:  "i",
            subject:  "s",
            audience:  "a",
            expiresIn:  expire,
            notBefore: "0",
            algorithm:  'HS256'
           };
           
        let privateKey = globalConfig.jwt
        var token = jwt.sign(
            data,
            privateKey! as string,
            verifyOptions as object
            )
        ;
        return token;
    }
    verifyToken(token: string)
    {
        var verifyOptions = {
            issuer:  "i",
            subject:  "s",
            audience:  "a",
            expiresIn:  "1h",
            notBefore: "0",
            algorithm:  'HS256'
           };
           let privateKey = globalConfig.jwt;
        return  jwt.verify(token, privateKey!, verifyOptions)
    }
}

export const jwtHandler = SingletonFactory.createInstance<JwtHandler>(JwtHandler);
