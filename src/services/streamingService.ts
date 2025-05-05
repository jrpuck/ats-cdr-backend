import { http } from '../utils/http';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import {
  AUTH_PATH,
  CDRS_PATH,
  LOG_AUTH_SUCCESS,
  LOG_AUTH_NO_TOKEN,
  LOG_AUTH_FAILED,
  LOG_STREAM_STARTED,
  LOG_STREAM_ERROR,
  LOG_STREAM_ENDED,
  LOG_INVALID_CDR,
  LOG_PARSE_STORE_ERROR,
  ERR_TOKEN_NULL,
  ERR_AUTH_FAILED,
} from '../constants';
import { CdrRecordSchema, CdrRecord } from '../schemas/cdrSchema';

/**
 * Handles auth + real-time CDR streaming from the remote API.
 */
export default class StreamingService {
  private token: string | null = null;
  private baseUrl = `${process.env.API_URL}:${process.env.API_PORT}`;

  /** 1) Authenticate once and cache JWT */
  async authenticate(): Promise<string> {
    try {
      const resp = await http.post(
        `${this.baseUrl}${AUTH_PATH}`,
        {},
        {
          auth: {
            username: process.env.API_USERNAME!,
            password: process.env.API_PASSWORD!,
          },
        },
      );
      this.token = resp.data.token;
      logger.info(LOG_AUTH_SUCCESS);

      if (!this.token) {
        logger.error(LOG_AUTH_NO_TOKEN);
        throw new Error(ERR_TOKEN_NULL);
      }
      return this.token;
    } catch (error: unknown) {
      logger.error(LOG_AUTH_FAILED, error);
      throw new Error(ERR_AUTH_FAILED);
    }
  }

  /** 2) Start real-time, keep-alive CDR stream */
  async start(): Promise<void> {
    if (!this.token) await this.authenticate();

    const res = await http.get(`${this.baseUrl}${CDRS_PATH}`, {
      headers: { Authorization: `Bearer ${this.token}` },
      responseType: 'stream',
      timeout: 0,
    });

    logger.info(LOG_STREAM_STARTED);
    res.data.on('data', (chunk: Buffer) => this.handleChunk(chunk));
    res.data.on('error', (err: Error) => logger.error(LOG_STREAM_ERROR, err));
    res.data.on('end', () => logger.warn(LOG_STREAM_ENDED));
  }

  /** store streamed data */
  private async handleChunk(chunk: Buffer) {
    try {
      const cdrs: Array<CdrRecord> = JSON.parse(chunk.toString());
      if (!Array.isArray(cdrs)) return;

      const valid: (Omit<CdrRecord, 'start_time' | 'end_time' | 'added_dt'> & {
        start_time: Date;
        end_time: Date;
        added_dt: Date;
      })[] = [];

      for (const raw of cdrs) {
        const parsed = CdrRecordSchema.safeParse(raw);
        if (!parsed.success) {
          logger.warn(LOG_INVALID_CDR, { issues: parsed.error.format() });
          continue;
        }
        const rec = parsed.data;
        valid.push({
          ...rec,
          start_time: new Date(rec.start_time),
          end_time: new Date(rec.end_time),
          added_dt: new Date(rec.added_dt),
        });
      }

      if (valid.length) {
        await prisma.cdr.createMany({ data: valid, skipDuplicates: true });
        logger.info(`Stored ${valid.length} CDR(s)`);
      }
    } catch (err: unknown) {
      logger.error(LOG_PARSE_STORE_ERROR, err);
    }
  }
}
