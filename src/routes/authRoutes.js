import { Router } from "express"
import { AuthController } from "../controllers/authController.js"

const authRouter = Router()

authRouter.post('/register', AuthController.register)
authRouter.post('/login', AuthController.login)
authRouter.post('/logout', AuthController.logout)
authRouter.post('/refresh', AuthController.refresh)

export default authRouter