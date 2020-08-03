import { Router } from 'express';
import ProvidersController from "../controllers/ProvidersController";
import ensureAuthenticated from '@models/users/infra/http/middlewares/ensureAuthenticated';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const providerController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMontAvailabilityController = new ProviderMonthAvailabilityController();

const providersRouter = Router();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providerController.get);

providersRouter.get('/:id/month-availability', providerMontAvailabilityController.index);
providersRouter.get('/:id/day-availability', providerDayAvailabilityController.index);

export default providersRouter;