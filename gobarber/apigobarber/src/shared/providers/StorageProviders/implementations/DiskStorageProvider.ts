import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from "../models/IStorageProvider";

class DiskStorageProvider implements IStorageProvider {

  public async save(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.destination, file)
    );

    return file;
  }

  public async delete(file: string): Promise<void> {
    try {
      await fs.promises.unlink(path.resolve(uploadConfig.tmpFolder, file));
      await fs.promises.unlink(path.resolve(uploadConfig.destination, file));

    }
    catch {
    }
  }

}

export default DiskStorageProvider;
