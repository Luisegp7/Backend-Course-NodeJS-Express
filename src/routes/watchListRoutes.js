import { Router } from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js"
import { WatchListItem } from "../controllers/watchListController.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { addToWatchListSchema } from "../schemas/watchListSchema.js"

const watchListRouter = new Router()

watchListRouter.get('/', verifyAccessToken, WatchListItem.getWatchListByUser)
watchListRouter.post('/', verifyAccessToken, validateSchema(addToWatchListSchema), WatchListItem.addTo)

export default watchListRouter