import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import ICacheProvider from './CacheProvider/models/ICacheProvider';
import NeDBCacheProvider from './CacheProvider/implementations/NeDBCacheProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import mailProvider from './MailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<ICacheProvider>('CacheProvider', NeDBCacheProvider);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.register<IMailProvider>(
  'MailProvider',
  mailProvider[mailConfig.driver],
);
