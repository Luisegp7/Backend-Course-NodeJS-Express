import * as z from 'zod'

export const validateSchema = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if(!result.success) {
        const flatten = z.flattenError(result.error)
        return res.status(400).json({errors: flatten})
    }

    req.body = result.data

    next()
}