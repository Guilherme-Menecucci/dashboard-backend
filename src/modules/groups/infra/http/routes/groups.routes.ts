import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import GroupsController from '../controllers/GroupsController';

const groupsRouter = Router();
const groupsController = new GroupsController();

groupsRouter.use(ensureAuthenticated);

groupsRouter.get('/', groupsController.index);
groupsRouter.post('/', groupsController.create);

groupsRouter.put('/:id', groupsController.update);

export default groupsRouter;
