import express from 'express'
import { DEFAULTS } from './config_defaults.js'
import { connectDB, disconnectDB } from './config/prismaClient.js'
import cookieParser from 'cookie-parser'
import { globalLimiter } from './config/rateLimit.js'

import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import movieRouter from './routes/movieRoutes.js'
import { errorHandler } from './middlewares/errorMiddleware.js'
import watchListRouter from './routes/watchListRoutes.js'

// Configuración del puerto
const PORT = DEFAULTS.PORT || 3000

// Conectar a la base de datos antes de iniciar el servidor
connectDB()

// Crear la aplicación Express
const app = express()

// Body parsing middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })) // Para parsear formularios tradionales de HTML
app.use(globalLimiter)

// Para que express confie en el proxy (si se despliega detrás de uno) y pueda obtener la IP real del cliente
app.set('trust proxy', 'loopback') // Solo confiar en el proxy si es local (ajustar según el entorno de despliegue);

// API Routes
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/movies', movieRouter)
app.use('/watchlist', watchListRouter)

// Middleware global para capturar errores centralizados.
app.use(errorHandler)

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