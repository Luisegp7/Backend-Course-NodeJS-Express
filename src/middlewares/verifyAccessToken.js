import 'dotenv/config'
import jwt from 'jsonwebtoken'


export const verifyAccessToken = (req, res, next) => {
    // 1. Leer el header Authorization: "Bearer eyJhbGc..."
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ message: 'No authorized' })
    }

    // 2. Separar "Bearer" del token real
    // authHeader = "Bearer eyJhbGc..."
    // split(' ') = ["Bearer", "eyJhbGc..."]
    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Malformed token' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

        // decoded = { sub: "123", iat: 1700000000, exp: 1700000900 }

        // 4. Adjuntas el id al request para usarlo en el controller
        const userId =  decoded.sub
        req.userId = userId

        next() // token válido, continúa al controller

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Expired token' })
        }
        // JsonWebTokenError → firma inválida, token manipulado, etc
        return res.status(401).json({ message: 'Invalid token' })
    }
}


// Esta funcion se usa si solo se implementa un token JWT en general sin refresh Token
/* export const verifyToken = (req, res, next) => {
    // Agarramos el cookie que envia el cliente
    const token = req.cookies.jwt

    // Comprobamos si el cookie existe
    if(!token) {
        return res.status(401).json({ message: 'No authorized'})
    }

    // Verificamos que el cookie sea valido
    try {
        //  jwt.verify hace todo:
        //    - Verifica que la firma sea válida con tu secret
        //    - Verifica que no haya expirado
        //    - Decodifica el payload y te lo devuelve
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Establezco en el request (req) quien es el usuario por medio de su ID para que se use en el controlador
        req.userId = decoded.id

        next() // Token válido, continúa al controlador.

    } catch (err) {
        if(err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Expired token' })
        }

        return res.status(401).json({message: 'Invalid token'})
    }

} */