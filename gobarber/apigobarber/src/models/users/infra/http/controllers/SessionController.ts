import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from '@models/users/services/AuthenticateUserService';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const service = container.resolve(AuthenticateUserService);

    const user = await service.execute({ email, password });

    return response.json(user);
  }
}
