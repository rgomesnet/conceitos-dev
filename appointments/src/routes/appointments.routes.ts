import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const repository = new AppointmentRepository();

appointmentsRouter.get('/', (request, response) => {

    const appointments = repository.all();

    return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
    const { provider, date } = request.body;

    const service = new CreateAppointmentService(repository);

    const parsedDate = parseISO(date);

    try {
        const appointment = service.execute({ date: parsedDate, provider });
        return response.json(appointment);
    }
    catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter;
