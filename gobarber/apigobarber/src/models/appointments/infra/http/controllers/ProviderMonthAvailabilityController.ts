import { Request, Response } from "express";
import { container } from "tsyringe";
import ListProviderMonthAvailabilityService from "@models/appointments/services/ListProviderMonthAvailabilityService";

export default class ProviderMonthAvailabilityController {

    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.params.id;
        const { month, year } = request.body;

        const service = container.resolve(
            ListProviderMonthAvailabilityService
        );

        const availabities = await service.execute({
            provider_id,
            month,
            year
        });

        return response.json(availabities);
    }
}