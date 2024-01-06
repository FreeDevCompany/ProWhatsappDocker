import * as crypto from 'crypto';

class CodeGenerator {

  static generateVerificationCode = (length: number) => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const codeArray = new Array<string>(length);
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytes[i] % characters.length;
      codeArray[i] = characters[randomIndex];
    }
    return codeArray.join('');
  }
}
export { CodeGenerator };
