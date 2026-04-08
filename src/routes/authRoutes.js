import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.js"
import { registerSchema, loginSchema } from "../schemas/userShema.js"
import { AuthController } from "../controllers/authController.js"
import { loginLimiter } from "../config/rateLimit.js"

const authRouter = Router()

authRouter.post('/register',validateSchema(registerSchema), loginLimiter ,AuthController.register)
authRouter.post('/login', validateSchema(loginSchema), loginLimiter ,AuthController.login)
authRouter.post('/logout', AuthController.logout)
authRouter.post('/refresh', AuthController.refresh)

export default authRouter