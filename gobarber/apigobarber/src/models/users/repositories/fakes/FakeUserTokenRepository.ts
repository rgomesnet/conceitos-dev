import IUserTokenRepository from "../IUserTokenRepository";
import UserToken from "@models/users/infra/typeorm/entities/UserToken";
import { uuid } from "uuidv4";

export default class FakeUserTokenRepository implements IUserTokenRepository {

  private userTokens: UserToken[] = [];

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(t => t.token === token);
    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {

    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    });

    this.userTokens.push(userToken);

    return userToken;
  }
}
