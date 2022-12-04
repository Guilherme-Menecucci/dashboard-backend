import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import ConferencesController from '../controllers/ConferencesController';

const conferencesRouter = Router();
const conferencesController = new ConferencesController();

conferencesRouter.use(ensureAuthenticated);
conferencesRouter.get('/', conferencesController.index);
conferencesRouter.post('/', conferencesController.create);

conferencesRouter.put('/:id', conferencesController.update);

export default conferencesRouter;
