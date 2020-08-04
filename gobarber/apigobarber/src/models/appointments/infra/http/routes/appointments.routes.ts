import { Router } from 'express';
import AppointmentController from '../controllers/AppointmentController';
import ensureAuthenticated from '@models/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentController();

appointmentsRouter.use(ensureAuthenticated);
appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
