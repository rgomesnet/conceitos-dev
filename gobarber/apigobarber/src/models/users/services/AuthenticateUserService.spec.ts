import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

import { isUuid } from 'uuidv4';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../infra/providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUserService', () => {

  it('Should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const hasProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(fakeUserRepository, hasProvider);
    const service = new AuthenticateUserService(fakeUserRepository, hasProvider);

    const user = await createUserService.execute({
      email: 'renato@rgomes.net',
      name: 'Renato Gomes',
      password: 'minhaSenha123'
    });

    expect(user).toHaveProperty('id');
    expect(isUuid(user.id)).toBeTruthy();

    const response = await service.execute({
      email: 'renato@rgomes.net',
      password: 'minhaSenha123'
    });

    expect(response).toHaveProperty('token');
  });

  it('Should not be able to authenticate', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const hasProvider = new FakeHashProvider();
    const service = new AuthenticateUserService(fakeUserRepository, hasProvider);

    await expect(service.execute({
      email: 'email@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const hasProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(fakeUserRepository, hasProvider);
    const service = new AuthenticateUserService(fakeUserRepository, hasProvider);

    await createUserService.execute({
      email: 'renato@rgomes.net',
      name: 'Renato Gomes',
      password: 'minhaSenha123'
    });

    await expect(service.execute({
      email: 'renato@rgomes.net',
      password: 'senha diferente'
    })).rejects.toBeInstanceOf(AppError)

  });

});
