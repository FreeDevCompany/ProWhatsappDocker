import bcrypt from 'bcrypt';
export class HashHelper {
    static encrypt = async(password: string): Promise<string> => 
    {
        return await bcrypt.hash(password, 8);
    }
    static compare = (sendedPassword: string, hashedPassword: string): boolean => {
        return bcrypt.compareSync(sendedPassword, hashedPassword);
    }
}