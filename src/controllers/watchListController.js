import { MovieModel } from "../models/movieModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export class WatchListItem {
    static getWatchListByUser = asyncHandler(async (req, res) => {
        const userWithMovies = await MovieModel.getAll(req.userId)

        return res.status(200).json({ 
            status: 'success',
            data: userWithMovies
        })

    })

}