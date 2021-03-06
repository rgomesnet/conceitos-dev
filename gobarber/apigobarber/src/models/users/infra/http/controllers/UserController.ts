import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import CreateUserService from '@models/users/services/CreateUserService';
import UpdateUserAvatarService from '@models/users/services/UpdateUserAvatarService';
import UserRepository from '../../typeorm/repository/UserRepository';

export default class UserController {
  public async get(request: Request, response: Response): Promise<Response> {
    const repository = container.resolve(UserRepository);
    const users = await repository.all();
    return response.json(users);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const userServices = container.resolve(CreateUserService);

    const user = await userServices.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(UpdateUserAvatarService);

    const { user, file } = request;

    const userUpdated = await service.execute({
      user_id: user.id,
      avatarFilename: file.filename,
    });

    return response.json(classToClass(userUpdated));
  }
}
