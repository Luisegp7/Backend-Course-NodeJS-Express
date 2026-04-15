import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg"

const isTest = process.env.NODE_ENV === 'test'
const connectionString = isTest && process.env.DATABASE_URL_TEST
    ? process.env.DATABASE_URL_TEST
    : process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined. Set DATABASE_URL or DATABASE_URL_TEST for test env.')
}

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