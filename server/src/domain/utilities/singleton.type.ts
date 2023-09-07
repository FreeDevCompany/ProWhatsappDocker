export class SingletonFactory {
    static createInstance<T> (constructor: new () => T): T{
        return new constructor()
    }
}