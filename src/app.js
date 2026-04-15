import express from 'express'
import cookieParser from 'cookie-parser'
import { globalLimiter } from './config/rateLimit.js'
import { corsMiddleware } from './middlewares/corsMiddleware.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import movieRouter from './routes/movieRoutes.js'
import watchListRouter from './routes/watchListRoutes.js'
import { errorHandler } from './middlewares/errorMiddleware.js'

export const createApp = () => {
    const app = express()

    // Middlewares 
    app.use(express.json())
    app.use(cookieParser())
    app.use(express.urlencoded({ extended: true }))
    app.use(globalLimiter)
    app.use(corsMiddleware)
    app.set('trust proxy', 'loopback')

    // Routes
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/movies', movieRouter)
    app.use('/watchlist', watchListRouter)

    // Error handling middleware
    app.use(errorHandler)

    return app
}