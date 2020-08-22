export default interface ICacheProvider {
    save(key: string, value: any): Promise<void>;
    invalidade(key: string): Promise<void>;
    invalidadePrefix(prefix: string): Promise<void>;
    get<T>(key: string): Promise<T | null>;
}