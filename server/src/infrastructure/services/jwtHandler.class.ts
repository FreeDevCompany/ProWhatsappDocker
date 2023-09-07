import jwt from 'jsonwebtoken';
import { SingletonFactory } from '../../domain/utilities/singleton.type';
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
           
        let privateKey = process.env.JWT_SECRET_KEY;
        var token = jwt.sign(
            data,
            privateKey! as string,
            verifyOptions as object,
        );
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
           let privateKey = process.env.JWT_SECRET_KEY;
        const decodedToken = jwt.verify(token, privateKey!, verifyOptions, (user, error) => {
            if (user) return user;
            if (error) throw error;
        });
        return decodedToken;
    }
}

export const jwtHandler = SingletonFactory.createInstance<JwtHandler>(JwtHandler);
