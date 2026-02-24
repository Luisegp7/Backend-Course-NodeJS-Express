import jtw from "jsonwebtoken"
import 'dotenv/config'

export const generateToken = (userId, res) => {
    const paylod = { id: userId }
    const token = jtw.sign(paylod, process.env.JSON_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    })

    res.cookie('jwt', token, {
        httpOnly: true,     // Con esto evitamos que el token sea accesible desde el Javascript del navegador del usuario, lo que ayuda a prevenir ataques de Cross-Site Scripting (XSS)
        secure: process.env.NODE_ENV === 'production', // Esto asegura que la cookie solo se envíe a través de conexiones HTTPS en producción, lo que ayuda a proteger el token durante la transmisión.
        sameSite: 'strict', // Esto evita que la cookie se envíe en solicitudes de sitios cruzados, lo que ayuda a prevenir ataques de Cross-Site Request Forgery (CSRF)
        maxAge: 7 * 24 * 60 * 60 * 1000 // Esto establece la duración de la cookie en 7 días, lo que coincide con la expiración del token JWT.
    })

    return token
}