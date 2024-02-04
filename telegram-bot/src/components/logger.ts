import log4js from 'log4js';

export class Logger {
    static configure(
        logLevel: string = 'debug',
        logFile: string = 'logs/combined.log',
        errorFile: string = 'logs/error.log',
    ) {
        log4js.configure({
            appenders: {
                console: { type: 'console' },
                file: { type: 'file', filename: logFile },
                error: { type: 'file', filename: errorFile },
            },
            categories: {
                default: { appenders: ['console', 'file'], level: logLevel },
                error: { appenders: ['error', 'file'], level: 'error' },
            },
        });
    }

    static getLogger(category: string = 'default') {
        Logger.configure();
        return log4js.getLogger(category);
    }
}
