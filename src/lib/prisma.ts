import "server-only";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient | null = (() => {
  if (!process.env.DATABASE_URL) return null;

  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
})();
