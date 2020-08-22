import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@models/users/services/AuthenticateUserService';
import { classToClass } from 'class-transformer';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const service = container.resolve(AuthenticateUserService);

    const { user, token } = await service.execute({ email, password });

    const user_avatar = classToClass(user);

    return response.json({ user: user_avatar, token });
  }
}
