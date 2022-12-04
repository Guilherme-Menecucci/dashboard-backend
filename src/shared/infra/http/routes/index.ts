import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

import conferencesRouter from '@modules/conferences/infra/http/routes/conferences.routes';

import groupsRouter from '@modules/groups/infra/http/routes/groups.routes';

const routes = Router();

routes.use('/password', passwordRouter);

routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);

routes.use('/users', usersRouter);

routes.use('/conferences', conferencesRouter);

routes.use('/groups', groupsRouter);

export default routes;
