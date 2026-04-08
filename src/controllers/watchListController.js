import { WatchListModel } from "../models/watchListModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";


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

        // Se tiene que verificar si la movie que se añadira al watchList del usuario existe.
        // Se tiene que verificar si la movie no ha sido añadida al watchList del usuario.

        const watchList = await WatchListModel.create(req.userId)

        if (!watchList) {
            return res.status(400).json({ message: 'Error to create'})
        }

        return res.status(201).json({
            status: 'success',
            data: watchList
        })
    })

}