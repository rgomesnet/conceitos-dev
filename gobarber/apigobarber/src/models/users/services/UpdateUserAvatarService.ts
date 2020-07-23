import User from '@models/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import IStorageProvider from '@shared/providers/StorageProviders/models/IStorageProvider';

interface Request {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,

    @inject('StorageProvider')
    private storage: IStorageProvider) {
  }

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.repository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar');
    }

    if (user.avatar) {
      await this.storage.delete(user.avatar);
    }

    user.avatar = await this.storage.save(avatarFilename);

    return await this.repository.save(user);
  }
}

export default UpdateUserAvatarService;
