import * as z from 'zod'
import 'dotenv/config'

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // 1. Log the error for debugging
  console.error(err)

  // 2. Guard Clause: If err is undefined or null, send a generic 500 and stop
  if (!err) {
    return res.status(500).json({ error: 'Internal server error (No error details)' })
  }

  // 3. Handle Prisma Unique Constraint
  if (err.code === 'P2002') {
    const field = err.meta?.target; // Prisma nos dice qué campo falló
    return res.status(409).json({ 
    error: `Ya existe un registro con ese ${field}`,
    field: field 
  })
  }
  // 4. Handle Prisma Not Found
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' })
  }

  // 5. Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  // 6. Zod errors
  if (err instanceof z.ZodError) {
    return res.status(400).json({ 
      errors: err.flatten().fieldErrors 
    });
}

  // 7. Final Fallback
  res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        // Solo enviamos el stack si no estamos en producción
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}