import { hash, compare } from 'bcryptjs';
import IHashProvider from "../models/IHashProvider";

export default class BCryptHashProvider implements IHashProvider {
  public async generate(payload: string): Promise<string> {
    return await hash(payload, 8);
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    try {
      return await compare(payload, hashed);
    } catch (error) {
      return false;
    }
  }
}
