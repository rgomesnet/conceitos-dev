import { Router } from 'express';
import AppointmentController from '../controllers/AppointmentController';
import ensureAuthenticated from '@models/users/infra/http/middlewares/ensureAuthenticated';
import ProviderAppointmentController from '../controllers/ProviderAppointmentsController';
import { celebrate, Segments, Joi } from 'celebrate';


const appointmentsRouter = Router();
const appointmentsController = new AppointmentController();
const providerAppointmentController = new ProviderAppointmentController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/',
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            date: Joi.date()
        }
    }),
    appointmentsController.create);

appointmentsRouter.get('/me', providerAppointmentController.index);

export default appointmentsRouter;
