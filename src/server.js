import express from 'express'
import { DEFAULTS } from './config_defaults.js'
import { prisma, connectDB, disconnectDB } from './config/prismaClient.js'

import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import movieRouter from './routes/movieRoutes.js'

const PORT = DEFAULTS.PORT || 3000

connectDB()

const app = express()

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Para parsear formularios tradionales de HTML

// API Routes
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/movies', movieRouter)

const server = app.listen(PORT, () => {
    console.log( `Server is running on port http://localhost:${PORT}`)
})

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
    console.error('Uncaught Exception:', err)
    server.close(async () => {
        await disconnectDB()
        process.exit(1)
    })
})

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err)
    await disconnectDB()
    process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully')
    server.close(async () => {
        await disconnectDB()
        process.exit(0)
    })
})