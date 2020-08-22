import IMailProvider from "../models/IMailProvider";
import nodemailer, { Transporter } from 'nodemailer';
import ISendMailDTO from '../dtos/ISendMailDTO';
import { injectable, inject } from 'tsyringe';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';
import IMailTemplateProvider from "@shared/providers/MailTemplateProviders/models/IMailTemplateProvider";

@injectable()
class SESMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ) {
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2020-12-01',
                region: 'sa-east-1'
            }),
        });
    }

    public async send({ to, from, subject, template }
        : ISendMailDTO): Promise<void> {

        try {
            const { name, email } = mailConfig.defaults.from;

            const message = await this.client.sendMail({
                from: {
                    name: from?.name || name,
                    address: from?.email || email,
                },
                to: {
                    name: to.name,
                    address: to.email,
                },
                subject,
                html: await this.mailTemplateProvider.parse(template),
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}

export default SESMailProvider;
