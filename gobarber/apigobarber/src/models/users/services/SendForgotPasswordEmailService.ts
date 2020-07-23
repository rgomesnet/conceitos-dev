import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository
  ) {
  }

  public async execute({ email }: IRequest): Promise<void> {
    const checkUserExists = await this.repository.findByEmail(email);
    if (!checkUserExists) {
      throw new AppError('User does not exists.');
    }

    const { token } = await this.userTokenRepository.generate(checkUserExists.id);

    await this.mailProvider.send(email,
      `Pedido de recuperação de senha recebido: ${token}`);
  }
}

export default SendForgotPasswordEmailService;
