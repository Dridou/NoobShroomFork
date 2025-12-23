import { PrismaClient } from '@prisma/client'

if (!process.env.MONGODB_URI && process.env.DATABASE_URL) {
  process.env.MONGODB_URI = process.env.DATABASE_URL
}
let prisma
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
