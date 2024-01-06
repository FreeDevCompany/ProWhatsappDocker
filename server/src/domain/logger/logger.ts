interface ILogger {
    log: (level: string, message: string | object) => void;
}
export {ILogger}