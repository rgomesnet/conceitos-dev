import
IParseMailTemplateDTO
    from "@models/MailTemplateProvider/dtos/IParseMailTemplateDTO";

interface IMailContact {
    name: string;
    email: string;
}

export default interface ISendMailDTO {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    template: IParseMailTemplateDTO;
}