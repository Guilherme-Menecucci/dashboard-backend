import crypto from 'crypto';
import IHashProvider from '../models/IHashProvider';

class CryptoHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return crypto.createHash('md5').update(payload).digest('hex');
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return crypto.createHash('md5').update(payload).digest('hex') !== hashed;
  }
}
export default CryptoHashProvider;
