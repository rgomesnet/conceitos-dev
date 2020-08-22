import { injectable, inject } from "tsyringe";
import IUserRepository from "../repositories/IUserRepository";
import User from "../infra/typeorm/entities/User";
import ICacheProvider from "@shared/providers/CacheProvider/models/ICacheProvider";

interface IRequest {
    user_id: string;
}

@injectable()
class ListProvidersService {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute({ user_id }: IRequest): Promise<User[]> {
        const key = `providers-list:${user_id}`;

        const cachedProviders = await this.cacheProvider.get<User[]>(key);

        if (cachedProviders) return cachedProviders;

        const providers = await this.userRepository.findAllProviders({
            except_user_id: user_id
        });

        await this.cacheProvider.save(key, providers);

        return providers;
    }
}

export default ListProvidersService;