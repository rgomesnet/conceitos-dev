import IHashProvider from '@models/users/infra/providers/HashProvider/models/IHashProvider';
import User from '@models/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private CacheProvider: ICacheProvider,
  ) {
  }

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkUserExists = await this.repository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hahsedPassword = await this.hashProvider.generate(password);

    const user = await this.repository.create({
      name,
      email,
      password: hahsedPassword,
    });

    await this.CacheProvider.invalidadePrefix('providers-list');

    return {
      id: user.id,
      name: user.name,
      email: user.email
    } as User;
  }
}

export default CreateUserService;
