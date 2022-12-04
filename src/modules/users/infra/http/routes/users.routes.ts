import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.use(ensureAuthenticated);
usersRouter.get('/', usersController.index);
usersRouter.post('/', usersController.create);

usersRouter.get('/:id', usersController.show);
usersRouter.put('/:id', usersController.update);

export default usersRouter;
