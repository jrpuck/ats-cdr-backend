import Transport from 'winston-transport';
import { prisma } from './prisma';

type PrismaTransportOptions = Transport.TransportStreamOptions;

interface Info {
  level: string;
  message: string;
}

export class PrismaTransport extends Transport {
  constructor(opts?: PrismaTransportOptions) {
    super(opts);
  }

  log(info: Info, callback: () => void) {
    // ensure winston has emitted the event
    setImmediate(() => this.emit('logged', info));

    // write to MySQL via Prisma
    prisma.log
      .create({
        data: {
          level: info.level,
          message: info.message,
        },
      })
      .catch((err) => {
        throw new Error(`Failed to log to Prisma: ${err}`);
      });

    callback();
  }
}
