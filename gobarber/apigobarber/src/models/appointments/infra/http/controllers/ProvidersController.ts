import { Request, Response } from "express";
import ListProvidersService from "@models/users/services/ListProvidersService";
import { container } from "tsyringe";

export default class ProvidersController {
    public async get(request: Request, response: Response) {
        const user_id = request.user.id;

        const listProvidersService = container.resolve(ListProvidersService);

        const providers = await listProvidersService.execute({
            user_id
        });

        return response.json(providers);
    }
}