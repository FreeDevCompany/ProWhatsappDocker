import argon2 from 'argon2';
export class HashHelper {
    static encrypt = async(password: string): Promise<string> => 
    {
        return await argon2.hash(password);
    }
    static compare = async(sendedPassword: string, hashedPassword: string): Promise<boolean> => {
        return await argon2.verify(hashedPassword, sendedPassword);
    }
}