import 'dotenv/config';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

import { isUuid } from 'uuidv4';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../infra/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUserRepository;
let hasProvider: FakeHashProvider;
let createUserService: CreateUserService;
let service: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUserService', () => {

  beforeEach(() => {

    fakeUserRepository = new FakeUserRepository();
    hasProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(fakeUserRepository, hasProvider, fakeCacheProvider);
    service = new AuthenticateUserService(fakeUserRepository, hasProvider);

  });

  it('Should be able to authenticate _01', async () => {

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

  it('Should not be able to authenticate _02', async () => {

    await expect(service.execute({
      email: 'email@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {

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
