import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { validateSchema } from '../middlewares/validateSchema.js'
import { updateUserSchema } from '../schemas/userShema.js'

const userRouter = Router()

userRouter.get('/profile', verifyAccessToken, UserController.getProfile)
userRouter.put('/profile/update', verifyAccessToken, validateSchema(updateUserSchema), UserController.update)

export default userRouter