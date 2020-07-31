import { Router } from 'express';
import AppointmentController from '../controllers/AppointmentController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentController();

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
