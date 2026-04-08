import { Router } from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js"
import { WatchListItem } from "../controllers/watchListController.js"

const watchListRouter = new Router()

watchListRouter.get('/', verifyAccessToken, WatchListItem.getWatchListByUser)
watchListRouter.post('/', verifyAccessToken, WatchListItem.addTo)

export default watchListRouter