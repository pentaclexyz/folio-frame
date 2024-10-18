import { defineConfig } from 'drizzle-kit';
import { z } from 'zod';

const envSchema = z.object({
  DB_NAME: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
});

export const dbConfig = envSchema.parse(process.env);

export default defineConfig({
  schema: './lib/db/drizzle/schema.ts',
  out: './lib/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    user: dbConfig.POSTGRES_USER,
    password: dbConfig.POSTGRES_PASSWORD,
    host: dbConfig.DB_HOST,
    port: dbConfig.DB_PORT,
    database: dbConfig.DB_NAME,
    ssl: dbConfig.DB_HOST !== 'localhost',
  },
});
