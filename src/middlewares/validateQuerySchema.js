import * as z from 'zod'

// Podemos hacer una sola esquema para los dos

export const validateQuerySchema = (schema) => (req, res, next) => {

    if (Object.keys(req.query).length === 0) {
        return next()
    }

    const result = schema.safeParse(req.query)

    if(!result.success) {
        const flatten = z.flattenError(result.error)
        return res.status(400).json({errors: flatten})
    }


    // El objeto req.query es de solo lectura (read-only).
    // Intentar sobrescribirlo directamente con req.query = result.data lanza ese TypeError.
    // SOLUCIÓN AL ERROR: 
    // En lugar de req.query = result.data, mutamos el objeto existente:
    Object.keys(req.query).forEach(key => delete req.query[key]); // Limpiamos el original
    Object.assign(req.query, result.data); // Copiamos los datos validados y transformados

    next()
}