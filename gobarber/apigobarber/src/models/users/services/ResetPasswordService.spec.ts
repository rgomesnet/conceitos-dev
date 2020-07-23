import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../infra/providers/HashProvider/fakes/FakeHashProvider';


let fakeRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let service: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('SendForgotPasswordEmailService', () => {

  beforeEach(() => {
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeHashProvider = new FakeHashProvider();

    service = new ResetPasswordService(
      fakeRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
      fakeHashProvider
    );
  })

  it('Should be able to reset the password using your email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'send');

    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@email.com',
      password: 'minhaSenha123'
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    const hashProvider = jest.spyOn(fakeHashProvider, 'generate');

    await service.execute({
      password: "123minhaSenha",
      token
    });

    const updatedUser = await fakeRepository.findById(user.id);

    expect(hashProvider).toHaveBeenCalledWith('123minhaSenha');
    expect(updatedUser?.password).toBe("123minhaSenha");
  });

  it('Should not be able to reset the password with non-existing token', async () => {
    await expect(
      service.execute({
        token: 'non-existing-token',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokenRepository.generate('non-existing-user');
    await expect(
      service.execute({
        token,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset the password if passed more than 2 hours', async () => {

    const user = await fakeRepository.create({
      name: 'John Doe',
      email: 'email@email.com',
      password: '123456'
    });

    const { token } = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      service.execute({
        token,
        password: 'minhaSenha123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

});
