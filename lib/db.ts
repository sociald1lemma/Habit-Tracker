import { PrismaClient } from '@prisma/client'
const host = globalThis as typeof globalThis & { db?: PrismaClient }
export const db = host.db ??= new PrismaClient()