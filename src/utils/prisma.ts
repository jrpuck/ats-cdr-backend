import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prisma.$on('info', (e: Prisma.LogEvent) => logger.info(e.message));
prisma.$on('warn', (e: Prisma.LogEvent) => logger.warn(e.message));
prisma.$on('error', (e: Prisma.LogEvent) => logger.error(e.message));
