import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma-client/client";

export class PrismaService {
  private static instance: PrismaClient;

  static get client(): PrismaClient {
    if (!this.instance) {
      const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 5,
      });

      this.instance = new PrismaClient({ adapter });
    }

    return this.instance;
  }

  static async connect(): Promise<void> {
    await this.client.$connect();
  }

  static async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}