import StreamingService from '../services/streamingService';
import { logger } from '../utils/logger';

let service: StreamingService | null = null;

/**
 * Initialize and start the real-time stream.
 * Call this once at app startup (e.g. in app.ts).
 */
export async function initRealTimeStream(): Promise<void> {
  if (service) return;
  service = new StreamingService();
  try {
    await service.start();
  } catch (err: unknown) {
    logger.error('Failed to init stream', err);
  }
}
