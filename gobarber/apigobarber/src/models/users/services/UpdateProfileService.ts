import 'reflect-metadata';
import User from '@models/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../infra/providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import passwordRouter from '../infra/http/routes/password.routes';

interface Request {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UserRepository')
        private repository: IUserRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider) {
    }

    public async execute({
        user_id,
        name,
        email,
        old_password,
        password
    }: Request): Promise<User | undefined> {

        console.log('old_password', old_password);

        let user = await this.repository.findByEmail(email);

        if (user && user.id !== user_id) {
            throw new AppError('Email already used. Incorrect email value.');
        }

        user = await this.repository.findById(user_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        user.name = name
        user.email = email;

        if (password) {
            const ableToUpdatePassword = await this.canUpdatePassword(user, password, old_password);

            if (ableToUpdatePassword) {
                user.password = await this.hashProvider.generate(password);
            }
        }

        return await this.repository.save(user);
    }

    private async canUpdatePassword(user: User, password?: string, old_password?: string): Promise<boolean> {
        if (password && !old_password) {
            throw new AppError('You need to inform the old password to set a new password.');
        }

        if (password && old_password) {
            const areEquals = await this.hashProvider.compare(old_password, user.password);

            if (!areEquals) {
                throw new AppError('You need to inform correct old password.');
            }
        }

        return true;
    }
}

export default UpdateProfileService;
