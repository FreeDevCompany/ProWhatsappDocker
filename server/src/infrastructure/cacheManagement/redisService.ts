import { Redis } from 'ioredis';
import { ICacheService } from '../../domain/logic/cacheManager.types.';
import { injectable } from 'inversify';
import globalConfig from '../../domain/logic/config';

@injectable()
export class CacheService<T> implements ICacheService<T>
{
    private redisClient: Redis;
    constructor()
    {
        this.redisClient = new Redis({
            connectTimeout: 10000,
            host: globalConfig.redis.host,
            port: globalConfig.redis.port as unknown as number,
        });
    }
    setCacheItem= (key: string, item: T):void => {
        this.redisClient.set(key, JSON.stringify(item));
    };
    getCacheItem= async(key: string):Promise<T> => {
        return JSON.parse(await this.redisClient.get(key)) as T;
    };
    removeCacheItem= (key: string) => {
        this.redisClient.del(key);
    };
    
}