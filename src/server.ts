import 'dotenv/config';
import { app } from './app';
import { logger } from './utils/logger';

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  logger.info(`Server up at http://localhost:${PORT}`);
});
