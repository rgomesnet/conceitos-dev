import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@models/users/services/UpdateProfileService';
import ShowProfileService from '@models/users/services/ShowProfileService';

export default class ProfileController {

    public async show(request: Request, response: Response) {
        const user_id = request.user.id;
        const showProfileService = container.resolve(ShowProfileService);
        const user = await showProfileService.execute({ user_id });
        return response.json(user);
    }

    public async update(request: Request, response: Response) {
        const {
            user_id,
            name,
            email,
            old_password,
            password
        } = request.body;

        const updateProfileService = container.resolve(UpdateProfileService);

        const user = await updateProfileService.execute({
            user_id,
            name,
            email,
            old_password,
            password,
        });

        delete user?.password;

        return response.json(user);
    }

}