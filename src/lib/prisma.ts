// ==============================================================================
// Prisma Client Singleton Instance (Prisma 7 + Driver Adapter)
// ==============================================================================
// In Prisma 7, a driver adapter (@prisma/adapter-pg) is required.
// In Next.js development mode, files are re-evaluated on HMR.
// To prevent creating multiple database connection pools, we cache them on globalThis.
// ==============================================================================

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pool;
}

export default prisma;
export * from "../generated/prisma/client";


