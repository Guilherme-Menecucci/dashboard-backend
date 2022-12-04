import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import TopicsController from '../controllers/TopicsController';

const topicsRouter = Router();
const topicsController = new TopicsController();

topicsRouter.use(ensureAuthenticated);
topicsRouter.get('/', topicsController.index);
topicsRouter.post('/', topicsController.create);

topicsRouter.get('/:id', topicsController.show);
topicsRouter.put('/:id', topicsController.update);

export default topicsRouter;
