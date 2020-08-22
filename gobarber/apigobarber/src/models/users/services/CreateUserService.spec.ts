import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import BCryptHashProvider from '../infra/providers/HashProvider/implementations/BCryptHashProvider';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

describe('CreateUserService', () => {
  it('Should be able to create a new User', async () => {
    const fakeRepository = new FakeUserRepository();
    const hasProvider = new BCryptHashProvider();
    const fakeCacheProvider = new FakeCacheProvider();
    const service = new CreateUserService(fakeRepository, hasProvider, fakeCacheProvider);

    const newUser = await service.execute({
      email: "email@email.com",
      name: "name",
      password: "password"
    });

    expect(newUser).toHaveProperty('id');
  });

  it('Should not be able to create a user with the same email', async () => {
    const fakeRepository = new FakeUserRepository();
    const hasProvider = new BCryptHashProvider();
    const fakeCacheProvider = new FakeCacheProvider();
    const service = new CreateUserService(fakeRepository, hasProvider, fakeCacheProvider);

    const newUser = await service.execute({
      email: "email@email.com",
      name: "name",
      password: "password"
    });

    expect(newUser).toHaveProperty('id');

    await expect(service.execute({
      email: "email@email.com",
      name: "name",
      password: "password"
    })).rejects.toBeInstanceOf(AppError);
  });
});
