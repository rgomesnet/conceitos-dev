import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsService from '@models/appointments/services/ListProviderAppointmentsService';
import { Exception } from 'handlebars';
import { classToClass } from 'class-transformer';

class ProviderAppointmentController {

    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.user.id;
        const { day, month, year } = request.query;

        const listProviderAppointments =
            container.resolve(ListProviderAppointmentsService);

        const appointments = await listProviderAppointments.execute({
            provider_id,
            day,
            month,
            year
        });

        return response.json(classToClass(appointments));
    }
}

export default ProviderAppointmentController;