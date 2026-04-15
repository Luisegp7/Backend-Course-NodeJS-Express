import { DEFAULTS } from './config_defaults.js'
import { connectDB, disconnectDB } from './config/prismaClient.js'
import { createApp } from './app.js'

// Configuración del puerto
const PORT = DEFAULTS.PORT || 3000

// Conectar a la base de datos antes de iniciar el servidor
connectDB()

// Crear la aplicación Express
const app = createApp()

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