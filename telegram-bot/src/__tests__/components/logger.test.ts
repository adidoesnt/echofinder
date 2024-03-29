import { describe, expect, it, spyOn } from 'bun:test';
import log4js from 'log4js';
import { Logger } from 'components/logger';

describe('Logger', () => {
    const loggerConfigSpy = spyOn(log4js, 'configure');
    const loggerGetSpy = spyOn(log4js, 'getLogger');

    it('should construct a logger', () => {
        try {
            // @ts-ignore
            new Logger();
        } catch (error) {
            expect(error).not.toBeDefined();
        }
    });

    it('should call log4js.configure with default log level', () => {
        Logger.getLogger();
        expect(loggerConfigSpy).toHaveBeenCalledWith({
            appenders: {
                console: { type: 'console' },
                file: { type: 'file', filename: 'logs/combined.log' },
                error: { type: 'file', filename: 'logs/error.log' },
            },
            categories: {
                default: { appenders: ['console', 'file'], level: 'debug' },
                error: { appenders: ['error', 'file'], level: 'error' },
            },
        });
    });

    it('should call log4js.configure with custom log level', () => {
        Logger.configure('info');
        Logger.getLogger();
        expect(loggerConfigSpy).toHaveBeenCalledWith({
            appenders: {
                console: { type: 'console' },
                file: { type: 'file', filename: 'logs/combined.log' },
                error: { type: 'file', filename: 'logs/error.log' },
            },
            categories: {
                default: { appenders: ['console', 'file'], level: 'debug' },
                error: { appenders: ['error', 'file'], level: 'error' },
            },
        });
    });

    it('should call log4js.getLogger with default category', () => {
        Logger.getLogger();
        expect(loggerGetSpy).toHaveBeenCalledWith('default');
    });

    it('should call log4js.getLogger with custom category', () => {
        Logger.getLogger('custom');
        expect(loggerGetSpy).toHaveBeenCalledWith('custom');
    });
});
