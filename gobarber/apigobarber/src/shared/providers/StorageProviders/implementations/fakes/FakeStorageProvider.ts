import IStorageProvider from "../../models/IStorageProvider";

class FakeStorageProvider implements IStorageProvider {

  private storage: string[] = [];

  public async save(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async delete(file: string): Promise<void> {
    const index = this.storage.findIndex(f => f === file);

    if (index) {
      this.storage.splice(index, 1);
    }
  }
}


export default FakeStorageProvider;
