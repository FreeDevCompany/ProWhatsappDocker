

export interface ICacheService<T>{
    setCacheItem: (key: string, item: T) => void;

    getCacheItem:(key: string)=> Promise<T>;

    removeCacheItem: (key: string) => void;
}