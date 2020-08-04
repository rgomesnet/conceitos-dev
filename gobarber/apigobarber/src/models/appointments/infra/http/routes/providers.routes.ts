import { Router } from 'express';
import ensureAuthenticated from '@models/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMontAvailabilityController = new ProviderMonthAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.get);
providersRouter.get('/:id/day-availability', providerDayAvailabilityController.index);
providersRouter.get('/:id/month-availability', providerMontAvailabilityController.index);

export default providersRouter;