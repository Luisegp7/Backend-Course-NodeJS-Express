import rateLimit from "express-rate-limit"

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50
})

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many login attempts"
})

