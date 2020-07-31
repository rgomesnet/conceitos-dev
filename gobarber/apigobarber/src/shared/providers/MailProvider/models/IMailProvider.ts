import ISendMailDTO from "../dtos/ISendMailDTO";

export default interface IMailProvider {
  send(data: ISendMailDTO): Promise<void>;
}
