export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug'
}

export class Logger {
    private static getTimestamp(): string {
        return new Date().toISOString();
    }

    private static formatMessage(level: LogLevel, message: string, meta?: any): string {
        const timestamp = this.getTimestamp();
        const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
    }

    public static error(message: string, meta?: any): void {
        console.error(this.formatMessage(LogLevel.ERROR, message, meta));
    }

    public static warn(message: string, meta?: any): void {
        console.warn(this.formatMessage(LogLevel.WARN, message, meta));
    }

    public static info(message: string, meta?: any): void {
        console.info(this.formatMessage(LogLevel.INFO, message, meta));
    }

    public static debug(message: string, meta?: any): void {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage(LogLevel.DEBUG, message, meta));
        }
    }
} 