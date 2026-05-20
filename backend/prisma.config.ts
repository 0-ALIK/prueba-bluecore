import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/shared/services/prisma/schema.prisma",
  migrations: {
    path: "src/shared/services/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});