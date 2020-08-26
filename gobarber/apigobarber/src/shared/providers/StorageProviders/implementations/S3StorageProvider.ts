import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from "../models/IStorageProvider";
import aws from 'aws-sdk';
import mime from 'mime';
import AppError from '@shared/errors/AppError';

class S3StorageProvider implements IStorageProvider {
    private client: aws.S3;

    constructor() {
        this.client = new aws.S3({
            region: 'sa-east-1',
            accessKeyId: process.env.STORAGE_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.STORAGE_AWS_SECRET_ACCESS_KEY
        });
    }

    public async save(file: string): Promise<string> {

        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        const fileContent = await fs.promises.readFile(originalPath);

        const ContentType = mime.getType(originalPath);

        if (!ContentType) {
            throw new AppError('File not found');
        }

        try {
            await this.client
                .putObject({
                    Bucket: uploadConfig.config.aws.bucket,
                    Key: file,
                    ACL: 'public-read',
                    Body: fileContent,
                    ContentType
                }).promise();
        }
        catch (err) {
            console.log(err);
        }

        return file;
    }

    public async delete(file: string): Promise<void> {

        await this.client
            .deleteObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: file
            }).promise();
    }
}

export default S3StorageProvider;
