import ICacheProvider from "../models/ICacheProvider";
import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import { Exception } from "handlebars";

interface ICacheData {
    [key: string]: string;
}
export default class FakeCacheProvider implements ICacheProvider {
    private caches: ICacheData = {};

    constructor() {
    }

    public async invalidadePrefix(prefix: string): Promise<void> {
        const keys = Object.keys(this.caches).filter(key => key.startsWith(`${prefix}:`));

        keys.forEach(key => {
            delete this.caches[key];
        })
    }

    public async save(key: string, value: any): Promise<void> {
        this.caches[key] = JSON.stringify(value);
    }

    public async invalidade(key: string): Promise<void> {
        delete this.caches[key];
    }

    public async get<T>(key: string): Promise<T | null> {
        const data = this.caches[key];

        if (!data) return null;

        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }
}