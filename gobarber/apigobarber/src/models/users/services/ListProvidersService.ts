import { injectable, inject } from "tsyringe";
import IUserRepository from "../repositories/IUserRepository";
import { Exception } from "handlebars";
import User from "../infra/typeorm/entities/User";

interface IRequest {
    user_id: string;
}

@injectable()
class ListProvidersService {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
    ) { }

    public async execute({ user_id }: IRequest): Promise<User[]> {
        return await this.userRepository.findAllProviders({
            except_user_id: user_id
        });
    }
}

export default ListProvidersService;