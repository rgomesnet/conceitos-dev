import IUserRepository from "@models/users/repositories/IUserRepository";
import ICreateUserDTO from "@models/users/dtos/ICreateUserDTO";
import { Repository, getRepository } from "typeorm";
import User from "../entities/User";

export default class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository<User>(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.repository.findOne({ where: { id } });
    return user || undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: { email }
    });
    return user;
  }

  public async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      email,
      password
    });

    return await this.save(user);
  }

  public async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }
}
