import { PrismaClient } from '@prisma/client'
import { migrateOldUploads } from '@/lib/uploads'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Migrate old uploads to persistent storage on first import
try { migrateOldUploads() } catch {}