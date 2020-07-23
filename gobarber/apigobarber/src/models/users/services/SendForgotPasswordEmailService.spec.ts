import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

let fakeRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let service: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {

  beforeEach(() => {
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();

    service = new SendForgotPasswordEmailService(
      fakeRepository,
      fakeMailProvider,
      fakeUserTokenRepository
    );
  })

  it('Should be able to recovery the password using your email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'send');

    await fakeRepository.create({
      name: 'John Doe',
      email: 'email@email.com',
      password: 'minhaSenha123'
    });

    await service.execute({
      email: "email@email.com"
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to recover a non-existing user password', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'send');

    await expect(service.execute({
      email: "email@email.com"
    })).rejects.toBeInstanceOf(AppError);

  });

  it('Should generate a forget password token', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'send');
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@email.com',
      password: 'minhaSenha123'
    });

    await service.execute({
      email: "email@email.com"
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);

  });

});
