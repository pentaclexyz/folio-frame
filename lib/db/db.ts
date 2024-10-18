import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { dbConfig } from '../../drizzle.config';
import * as schema from '@lib/db/drizzle/schema';

const queryClient = postgres(
  `postgres://${dbConfig.POSTGRES_USER}:${dbConfig.POSTGRES_PASSWORD}@${dbConfig.DB_HOST}:${dbConfig.DB_PORT}/${dbConfig.DB_NAME}`,
);

export const db = drizzle(queryClient, { schema });
