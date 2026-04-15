import { WatchListModel } from "../models/watchListModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { MovieModel } from "../models/movieModel.js";


export class WatchListItem {
    static getWatchListByUser = asyncHandler(async (req, res) => {
        const userWithMovies = await WatchListModel.getByUser(req.userId)

        if (!userWithMovies) {
            return res.status(404).json({ message: 'This user dont have movies in his watchlist'})
        }

        return res.status(200).json({ 
            status: 'success',
            data: userWithMovies
        })
    })

    static addTo = asyncHandler(async (req, res) => {
        const { movieId, status, rating, notes } = req.body

        const movie = await MovieModel.findById(movieId)

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' })
        }

        const existingItem = await WatchListModel.findByUserAndMovie(req.userId, movieId)

        if (existingItem) {
            return res.status(409).json({ message: 'Movie already in watchlist' })
        }

        const watchList = await WatchListModel.create(req.userId, {
            movieId,
            status,
            rating,
            notes
        })

        if (!watchList) {
            return res.status(400).json({ message: 'Error to create'})
        }

        return res.status(201).json({
            status: 'success',
            data: watchList
        })
    })

}