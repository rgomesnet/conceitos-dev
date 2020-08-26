import ICacheProvider from "../models/ICacheProvider";
import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

export default class RedisCacheProvider implements ICacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    public async invalidadePrefix(prefix: string): Promise<void> {
        const keys = await this.client.keys(`${prefix}:*`);
        const pipeline = this.client.pipeline();
        keys.forEach(key => pipeline.del(key));
        await pipeline.exec();
    }

    public async save(key: string, value: any): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    public async invalidade(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);

        if (!data) return null;

        return JSON.parse(data) as T;
    }
}