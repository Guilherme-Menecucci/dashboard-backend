import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import CryptoHashProvider from './HashProvider/implementations/CryptoHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', CryptoHashProvider);
