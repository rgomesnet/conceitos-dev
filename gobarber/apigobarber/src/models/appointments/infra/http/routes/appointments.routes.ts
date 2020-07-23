import { Router } from 'express';
import AppointmentController from '../controllers/AppointmentController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentController();

// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await repository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
