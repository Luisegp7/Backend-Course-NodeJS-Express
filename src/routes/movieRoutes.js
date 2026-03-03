import { Router } from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js"
import { MovieController } from "../controllers/movieController.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { movieQuerySchema, movieSchema } from "../schemas/movieSchema.js"
import { validateQuerySchema } from "../middlewares/validateQuerySchema.js"


const movieRouter = Router()

//movieRouter.get('/per-user/:id')
movieRouter.get('/', verifyAccessToken, validateQuerySchema(movieQuerySchema) ,MovieController.getAll)
movieRouter.post('/create', verifyAccessToken, validateSchema(movieSchema), MovieController.create )

export default movieRouter