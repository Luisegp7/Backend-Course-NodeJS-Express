import { Router } from "express"
import { verifyAccessToken } from "../middlewares/verifyAccessToken"
import { WatchListItem } from "../controllers/watchListController.js"

const watchListRouter = new Router()

watchListRouter.get('/', verifyAccessToken, WatchListItem.getWatchListByUser)