import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IClientUsersRepository from '@modules/users/repositories/IClientUsersRepository';
import ClientUsersRepository from '@modules/users/infra/typeorm/repositories/ClientUsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IConferencesRepository from '@modules/conferences/repositories/IConferencesRepository';
import ConferencesRepository from '@modules/conferences/infra/typeorm/repositories/ConferencesRepository';

import IGroupsRepository from '@modules/groups/repositories/IGroupsRepository';
import GroupsRepository from '@modules/groups/infra/typeorm/repositories/GroupsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IClientUsersRepository>(
  'ClientUsersRepository',
  ClientUsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IConferencesRepository>(
  'ConferencesRepository',
  ConferencesRepository,
);

container.registerSingleton<IGroupsRepository>(
  'GroupsRepository',
  GroupsRepository,
);
