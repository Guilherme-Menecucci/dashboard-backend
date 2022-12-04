import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import SessionsController from '../controllers/SessionsController';
import SessionsClientController from '../controllers/SessionsClientController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();
const sessionsClientController = new SessionsClientController();

sessionsRouter.post('/', sessionsController.create);

sessionsRouter.use(ensureAuthenticated);
sessionsRouter.post('/client', sessionsClientController.create);

export default sessionsRouter;
