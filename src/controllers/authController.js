import { prisma } from "../config/prismaClient.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generatedToken.js"

export class AuthController {

    static async register(req, res) {
        const { name, email, password } = req.body

        // Check if all required fields are provided
        if( !name || !email || !password ) {
            return res.status(400).json({ error: 'Name, email and password are required'})
        }

        // Checks if user already exists in the database
        const userExists = await prisma.user.findUnique({
            where: { email }
        })

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
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        // Generate JWT Token
        const token = generateToken(newUser.id, res)

        /*
        Le enviamos al cliente el token para que la puedan guardar en un lugar seguro, como una cookie o el localStorage
        Despues con este token podran acceder a las rutas protegidas de la aplicacion, enviando el token en el header de la peticion, por ejemplo:
        Authorization: Bearer <token>
        */

        return res.status(201).json({ 
            status: 'success',
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            },
            token
        })
    }

    static async login(req, res) {
        const { email, password } = req.body

        if( !email || !password ) {
            return res.status(400).json({ message: 'Email and password are required'})
        }

        // Check if user exists in the database
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(404).json({ error: 'Invalid email or password' })
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        
        // Generate JWT Token
        const token = generateToken(user.id, res)

        return res.status(200).json({ 
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    email: user.email
                }
            },
            token
        })
    }

    static async logout(req, res) {
        res.cookie('jwt', '', {
            httpOnly: true,
            experies: new Date(0), // Esto establece la fecha de expiración de la cookie en el pasado, lo que hace que el navegador elimine la cookie inmediatamente.
        })

        return res.status(200).json({
            status: 'sucess',
            message: 'Logged out successfully'
        })
    }
}