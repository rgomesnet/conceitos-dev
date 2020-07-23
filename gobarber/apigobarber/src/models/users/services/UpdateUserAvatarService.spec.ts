import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import { isUuid } from 'uuidv4';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeStorageProvider from '@shared/providers/StorageProviders/implementations/fakes/FakeStorageProvider';

describe('UpdateUserAvatarService', () => {

  it('Should be able to update avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const storage = new FakeStorageProvider();

    const service = new UpdateUserAvatarService(fakeUserRepository, storage);

    const user = await fakeUserRepository.create({
      email: 'renato@rgomes.net',
      name: 'Renato Gomes',
      password: 'minhaSenha123'
    });

    expect(user).toHaveProperty('id');
    expect(isUuid(user.id)).toBeTruthy();

    await service.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('Should note be able to update avatar from unexists user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const storage = new FakeStorageProvider();

    const service = new UpdateUserAvatarService(fakeUserRepository, storage);

    await expect(service.execute({
      user_id: 'non-existing-user',
      avatarFilename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to delete existing avatar before replace it', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const storage = new FakeStorageProvider();

    const deleteFunction = jest.spyOn(storage, 'delete');

    const service = new UpdateUserAvatarService(fakeUserRepository, storage);

    const user = await fakeUserRepository.create({
      email: 'renato@rgomes.net',
      name: 'Renato Gomes',
      password: 'minhaSenha123'
    });

    await service.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });

    expect(user.avatar).toBe('avatar.jpg');

    await service.execute({
      user_id: user.id,
      avatarFilename: 'new-avatar.jpg'
    });

    expect(deleteFunction).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('new-avatar.jpg');

  });

});
