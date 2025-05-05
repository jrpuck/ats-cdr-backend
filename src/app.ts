import express, { Request, Response, NextFunction } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import expressWinston from 'express-winston';
import { logger } from './utils/logger';
import cdrRoutes from './routes/cdrRoutes';
import { initRealTimeStream } from './controllers/streamingController';

import {
  API_ROOT,
  DOCS_ROOT,
  SWAGGER_OPENAPI,
  SWAGGER_TITLE,
  SWAGGER_VERSION,
  SWAGGER_DESCRIPTION,
  SWAGGER_APIS_GLOB,
  LOG_HTTP_MSG,
  LOG_SKIP_PREFIX,
  ERROR_NOT_FOUND,
  ERR_INTERNAL_SERVER,
  STREAM_INIT_ERROR,
} from './constants';

// Swagger/OpenAPI setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: SWAGGER_OPENAPI,
    info: {
      title: SWAGGER_TITLE,
      version: SWAGGER_VERSION,
      description: SWAGGER_DESCRIPTION,
    },
  },
  apis: [SWAGGER_APIS_GLOB],
});

export const app = express();
app.use(express.json());

// HTTP request logging
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    msg: LOG_HTTP_MSG,
    skip: (req) => req.url.startsWith(LOG_SKIP_PREFIX),
  }),
);

// mount your CDR routes
app.use(API_ROOT, cdrRoutes);

// docs endpoint
app.use(DOCS_ROOT, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: ERROR_NOT_FOUND });
});

// error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ error: ERR_INTERNAL_SERVER });
});

// ——— start real-time stream on app load ———
initRealTimeStream().catch((err) => logger.error(STREAM_INIT_ERROR, err));
