// src/utils/logger.ts
import { createLogger, format, transports } from 'winston';
import { PrismaTransport } from './PrismaTransport';

const { combine, timestamp, printf, errors } = format;

const logFormat = printf(
  ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`,
);

export const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({
      /*  */
    }),
    logFormat,
  ),
  transports: [
    // keep console for dev
    new transports.Console(),

    // write every entry to MySQL
    new PrismaTransport(),
  ],
  exitOnError: false,
});
