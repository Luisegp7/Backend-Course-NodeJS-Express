export const errorHandler = (err, req, res, next) => {
  // 1. Log the error for debugging
  console.error(err);

  // 2. Guard Clause: If err is undefined or null, send a generic 500 and stop
  if (!err) {
    return res.status(500).json({ error: 'Internal server error (No error details)' });
  }

  // 3. Handle Prisma Unique Constraint
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  // 4. Handle Prisma Not Found
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  // 5. Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // 6. Final Fallback
  return res.status(500).json({ error: err.message || 'Internal server error' });
}