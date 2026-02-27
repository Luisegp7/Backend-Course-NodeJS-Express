import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.js"
import { registerSchema, loginSchema } from "../schemas/userShema.js"
import { AuthController } from "../controllers/authController.js"

const authRouter = Router()

authRouter.post('/register',validateSchema(registerSchema),AuthController.register)
authRouter.post('/login', validateSchema(loginSchema) ,AuthController.login)
authRouter.post('/logout', AuthController.logout)
authRouter.post('/refresh', AuthController.refresh)

export default authRouter