import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";

const userRouter = Router()

userRouter.get('/profile', verifyAccessToken, UserController.getProfile)

export default userRouter