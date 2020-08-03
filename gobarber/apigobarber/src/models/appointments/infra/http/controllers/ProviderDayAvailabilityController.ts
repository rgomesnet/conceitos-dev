import { Request, Response } from "express";
import { container } from "tsyringe";
import ListProviderDayAvailability from "@models/appointments/services/ListProviderDayAvailability";

export default class ProviderDayAvailabilityController {

    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.params.id;
        const { day, month, year } = request.body;

        const service = container.resolve(
            ListProviderDayAvailability
        );

        const availabities = await service.execute({
            provider_id,
            day,
            month,
            year
        });

        return response.json(availabities);
    }
}