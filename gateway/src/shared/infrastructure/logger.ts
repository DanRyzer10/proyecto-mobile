import winston from 'winston';
import path from 'path';

export class Logger {
    private logger: winston.Logger;

    constructor() {
        const logFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json()
        );

        const consoleFormat = winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...metadata }) => {
                let msg = `${timestamp} [${level}]: ${message}`;
                if (Object.keys(metadata).length > 0) {
                    msg += ` ${JSON.stringify(metadata)}`;
                }
                return msg;
            })
        );

        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: logFormat,
            transports: [
                // Consola
                new winston.transports.Console({
                    format: consoleFormat
                }),
                // Archivo para todos los logs
                new winston.transports.File({ 
                    filename: path.join('logs', 'combined.log'),
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                }),
                // Archivo solo para errores
                new winston.transports.File({ 
                    filename: path.join('logs', 'error.log'),
                    level: 'error',
                    maxsize: 5242880,
                    maxFiles: 5,
                })
            ]
        });
    }

    info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }

    error(message: string, error?: Error | any): void {
        this.logger.error(message, { error: error?.message, stack: error?.stack, ...error });
    }

    warn(message: string, meta?: any): void {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: any): void {
        this.logger.debug(message, meta);
    }

    http(message: string, meta?: any): void {
        this.logger.http(message, meta);
    }
}