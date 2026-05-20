import express, { Application } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Routes } from './routes';
import { PrismaService } from './shared/services/prisma/prisma.service';
import { errorHandler } from './shared/middlewares/error-handler.middleware';

export class Server {
  private app: Application;

  constructor() {
    this.app = express();
  }

  async start(): Promise<void> {
    this.globalMiddlewares();
    this.healthCheck();
    await PrismaService.connect();

    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    this.handleShutdown();
  }

  private healthCheck(): void {
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok' });
    });
  }

  private globalMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: true,
        legacyHeaders: false,
      })
    );
    this.app.use(Routes.routes);
    this.app.use(errorHandler);
  }

  private handleShutdown(): void {
    process.on('SIGINT', async () => {
      await PrismaService.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await PrismaService.disconnect();
      process.exit(0);
    });
  }
}
