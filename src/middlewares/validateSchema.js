import * as z from 'zod'

// Podemos hacer una sola esquema para los dos

export const validateSchema = (schema) => (req, res, next) => {
    // 1. Detectamos si el esquema tiene el campo 'createdBy'
    const isMovieOrResourceWithCreator = schema.shape && 'createdBy' in schema.shape

    const dataToValidate = {
        ...req.body,
        ...(isMovieOrResourceWithCreator && req.userId && { createdBy: req.userId })
    }

    const result = schema.safeParse(dataToValidate)

    if(!result.success) {
        const flatten = z.flattenError(result.error)
        return res.status(400).json({errors: flatten})
    }

    req.body = result.data

    next()
}

// Estas funciones son para validar schema general y el de abajo esquema de peliculas

/* export const validateSchema = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if(!result.success) {
        const flatten = z.flattenError(result.error)
        return res.status(400).json({errors: flatten})
    }

    req.body = result.data

    next()
}

export const validateMovieSchema = (schema) => (req, res, next) => {
   
    // Combinamos el body con el ID del usuario que viene del token
    const dataToValidate = {
        ...req.body,
        createdBy: req.userId // Asumimos que tu middleware de auth ya puso esto aquí
    };

    const result = schema.safeParse(dataToValidate)

    if(!result.success) {
        const flatten = z.flattenError(result.error)
        return res.status(400).json({ errors: flatten })
    }

    req.body = result.data

    next()
} */