// ==============================================================================
// Prisma Client Singleton Instance
// ==============================================================================
// In Next.js development mode, files are re-evaluated on every code change (HMR).
// To prevent creating multiple database connections, we store the instance on globalThis.
// ==============================================================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
