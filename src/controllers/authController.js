import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from '../utils/asyncHandler.js'
import { UserModel } from "../models/userModel.js"
import { RefreshTokenModel } from "../models/refreshTokenModel.js"

export class AuthController {

    // En register y login se usa para atrapar los errores un wrapper de middleware
    static register = asyncHandler(async (req, res) => {

        const { name, email, password } = req.body

        // Checks if user already exists in the database
        const userExists = await UserModel.findByEmail( email )

        if (userExists) {
            return res.status(409).json({ error: 'User with this email already exists' })
        }

        // After pass all validatiions, we hash the password and create the user in the database
        // Hash the password
        const salt = await bcrypt.genSalt(10) // Aqui estamos generando un salt con 10 rondas de procesamiento, lo que hace que el hash sea más seguro.
        // Esto significa que hara 1024 iteraciones internas para generar el salt, esto quiere decir que generara 22 caracteres aleatorios para el salt,
        // lo que hace que el hash sea único incluso para contraseñas iguales.
        // El salt genera $2b$10$ seguido de los caracteres aletoriosdel salt real. 
        // $2b indica el algoritmo de hash utilizado, en este caso bcrypt, y $10 indica el costo o número de rondas de procesamiento utilizado para generar el hash.

        // Luego, el hash se genera combinando la contraseña del usuario con el salt y aplicando el algoritmo bcrypt.
        // El resultado es un hash que incluye tanto el salt como la contraseña hasheada, lo que permite verificar la contraseña en el futuro utilizando el mismo salt.
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create the user in the database
        const user = await UserModel.create({ name, email, hashedPassword })

        // Generamos el Access Token, este token solo tiene 5 minutos de vida
        const accessToken = generateAccessToken(user.id)

        // Generamos el Refresh Token, este token tiene 7 dias de vida
        const refreshToken = generateRefreshToken(user.id, res)

        // Guardamos el Refresh Token en la base de datos.
        await RefreshTokenModel.create({ userId:user.id , refreshToken })

        /*
        Le enviamos al cliente el token para que la puedan guardar en un lugar seguro, como una cookie o el localStorage
        Despues con este token podran acceder a las rutas protegidas de la aplicacion, enviando el token en el header de la peticion, por ejemplo:
        Authorization: Bearer <token>
        */

        return res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            accessToken
        })
    })


    static login = asyncHandler(async (req, res) => {
        const { email, password } = req.body

        // Check if user exists in the database
        const user = await UserModel.findByEmail(email)
        

        if (!user) {
            return res.status(404).json({ error: 'Invalid email or password' })
        }

        const userId = user.id

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Generamos el Access Token, este token solo tiene 5 minutos de vida
        const accessToken = generateAccessToken(userId)

        // Generamos el Refresh Token, este token tiene 7 dias de vida
        const refreshToken = generateRefreshToken(userId, res)

        // Borramos los Refresh Token anteriores
        await RefreshTokenModel.deleteMany(userId)

        // Guardamos el Refresh Token en la base de datos.
        await RefreshTokenModel.create({ userId, refreshToken })

        return res.status(200).json({
            status: 'success',
            data: {
                user: {
                    name: user.name,
                    email: user.email
                }
            },
            accessToken
        })
    })


    // Para refresh y logout se usan los bloques try y catch
    static refresh = asyncHandler(async (req, res) => {
        const oldRefreshToken = req.cookies.jwt

        // Verificamos que el token exista (que el navegador nos lo haya enviado)
        // Si no existe lo forzamos a Login 
        if (!oldRefreshToken) {
            return res.status(401).json({ message: 'No authorized' })
        }

        // Verificamos la firma, que sea valido.
        const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET)
        const userId = decoded.sub


        // Buscamos en la base de datos que exista ese token 
        const storedToken = await RefreshTokenModel.findByToken(oldRefreshToken)

        // Verificamos si existe y su tiempo de expiracion siga vigente
        // Si no esta vigente o no esta en la base de datos lo forzamos a Login 
        if (!storedToken || storedToken.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Invalid refresh token' })
        }

        // Rotar el refresh token
        await RefreshTokenModel.deleteByToken(oldRefreshToken)

        // Creamos un nuevo refresh token y lo guardamos en la DB
        const refreshToken = generateRefreshToken(storedToken.userId, res)
        await RefreshTokenModel.create({ userId, refreshToken })

        const newAccessToken = generateAccessToken(storedToken.userId)
        return res.status(200).json({ accessToken: newAccessToken })

    })

    
    static logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.jwt

        // Borrar de BD si existe
        if (refreshToken) {
            await RefreshTokenModel.deleteByToken(refreshToken)
        }

        // Limpiar la cookie
        res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'strict',
        secure: true
        })

        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        })
    })

}