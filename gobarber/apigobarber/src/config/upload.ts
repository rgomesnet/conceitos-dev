import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';
import { string } from '@hapi/joi';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  destination: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {},
    aws: {
      bucket: string;
    }
  }
}

const getRandom = () => Math.trunc((Math.random() * (999 - 100) + 100));

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  destination: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = `${getRandom()}${getRandom()}${getRandom()}${getRandom()}`;
        const filename = `${fileHash}-${file.originalname}`;
        return callback(null, filename);
      }
    })
  },

  config: {
    disk: {},
    aws: {
      bucket: 'https://rgomesnet.s3-sa-east-1.amazonaws.com'
    }
  }

} as IUploadConfig;
