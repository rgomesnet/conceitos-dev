import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailability from '@models/appointments/services/ListProviderDayAvailability';

export default class ProviderDayAvailabilityController {

    public async index(request: Request, response: Response): Promise<Response> {
        const { day, month, year, provider_id } = request.query;
        const service = container.resolve(ListProviderDayAvailability);

        const availabilities = await service.execute({
            day: Number(day),
            month: Number(month),
            provider_id: String(provider_id),
            year: Number(year)
        });

        return response.json(availabilities);
    }
}