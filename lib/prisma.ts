import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Reuse the SAME pool and client across hot reloads in dev mode.
// This is the #1 cause of slowness — each request was potentially spinning up a new connection.
const getPrisma = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,             // Max 20 connections in pool (scaled for 1000+ orders/day)
    idleTimeoutMillis: 30000,  // Close idle connections after 30s
    connectionTimeoutMillis: 5000,  // Fail fast if DB is unreachable (5s)
  });

  globalForPrisma.pool = pool;

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  globalForPrisma.prisma = prisma;
  return prisma;
};

export const prisma = getPrisma();
