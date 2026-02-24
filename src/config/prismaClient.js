import "dotenv/config";
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

export const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log('Connected to the database successfully.')
    } catch (error) {
        console.error(`Database connection error: ${error.message}`)
        process.exit(1)
    }
}

export const disconnectDB = async () => {
    await prisma.$disconnect()
}