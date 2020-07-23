import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../infra/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import { differenceInHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {
  }

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.repository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreateAt = userToken.created_at;

    if (differenceInHours(Date.now(), tokenCreateAt) > 2) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generate(password);
    await this.repository.save(user);
  }
}

export default ResetPasswordService;
