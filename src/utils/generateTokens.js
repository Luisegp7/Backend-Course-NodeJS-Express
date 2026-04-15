import jwt from "jsonwebtoken"
import 'dotenv/config'
import { randomUUID } from 'crypto'


export const generateAccessToken = (userId) => {
    const payload = { sub: userId }
    const secret = process.env.JWT_ACCESS_SECRET
    const EXPIRES_ACCESS_TOKEN_IN = parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '5')

    if (!secret) throw new Error('JWT_ACCESS_SECRET no esta definido en .env')

    const token = jwt.sign(payload, secret, {
        expiresIn: `${EXPIRES_ACCESS_TOKEN_IN}m`
    })

    return token
}

export const generateRefreshToken = (userId, res) => {
    const payload = { sub: userId, jti: randomUUID() }
    const secret = process.env.JWT_REFRESH_SECRET
    const EXPIRE_REFRESH_TOKEN_IN = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || 7)

    if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined in .env')

    const refreshToken = jwt.sign(payload, secret, {
        expiresIn: `${EXPIRE_REFRESH_TOKEN_IN}d`
    })

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: EXPIRE_REFRESH_TOKEN_IN * 24 * 60 * 60 * 1000 
    })

    return refreshToken 
}
/* 
export const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: EXPIRE_REFRESH_TOKEN_IN * 24 * 60 * 60 * 1000 
    })
}
 */

// Esta opcion es solo para manejar un token JWT el problema es que no podemos revocar permisos.
/* export const generateToken = (userId, res) => {
    const paylod = { id: userId } // Nunca guardar contraseñas ni datos sensibles en el payload ya que no esta encriptado.
    const secret = process.env.JWT_SECRET
    const EXPIRES_IN_DAYS = parseInt(process.env.JWT_EXPIRES_IN || '7')

    if (!secret) throw new Error('JWT_SECRET no está definido en .env')

    const token = jwt.sign(paylod, secret,{
        expiresIn: `${EXPIRES_IN_DAYS}m`
    })

    res.cookie('jwt', token, {
        httpOnly: true,     // Con esto evitamos que el token sea accesible desde el Javascript del navegador del usuario, lo que ayuda a prevenir ataques de Cross-Site Scripting (XSS)
        secure: process.env.NODE_ENV === 'production', // Esto asegura que la cookie solo se envíe a través de conexiones HTTPS en producción, lo que ayuda a proteger el token durante la transmisión.
        sameSite: 'strict', // Esto evita que la cookie se envíe en solicitudes de sitios cruzados, lo que ayuda a prevenir ataques de Cross-Site Request Forgery (CSRF)
        //maxAge: EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000 // Esto establece la duración de la cookie en 7 días, lo que coincide con la expiración del token JWT.
        maxAge: 5 * 60 * 1000 // 5 minutos
    })

    return token
}
 */