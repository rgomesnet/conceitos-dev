import { injectable, inject } from 'tsyringe';
import User from '@models/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

interface Request {
    user_id: string;
}

@injectable()
class ShowProfileService {
    constructor(
        @inject('UserRepository')
        private repository: IUserRepository) {
    }

    public async execute({
        user_id,
    }: Request): Promise<User | undefined> {

        const user = await this.repository.findById(user_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        delete user.password;

        return user;
    }
}

export default ShowProfileService;
