import { MovieModel } from "../models/movieModel.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { movieFilterParams } from "../utils/movieFilters.js"

export class MovieController {

    static getAll = asyncHandler(async (req, res) => {
        
        // Extraemos todos los posibles filtros del query string
        const { title, releaseYear, genres, runtime, createdBy, limit, offset } = req.query
        console.log(genres)
        const searchParams = movieFilterParams({ title, releaseYear, genres, runtime, createdBy, limit, offset })

        // Si viene título, buscamos; si no, traemos todas.
        const movies = await MovieModel.getAll(searchParams) 

        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: 'No movies found' });
        }

        return res.status(200).json({
            status: 'success',
            results: movies.length,
            data: movies
        })
    })


    static create = asyncHandler(async (req, res) => {
        const data = req.body

        const movie = await MovieModel.create(data)

        if (!movie) {
            return res.status(400).json({ message: 'Movie Not Created'})
        }

        return res.status(201).json({
            status: 'success',
            data: movie
        })

    })

      /* static getByTitle = asyncHandler(async (req, res) => {

        const { title, genre, runtime } = req.query
        const decodedTitle = decodeURIComponent(title);

        const movie = await MovieModel.getByTitle(decodedTitle)

        if(!movie) {
            return res.status(404).json({ message: 'Movie Not Found'})
        }

        return res.status(200).json({
            status: 'success',
            data: movie
        })
    }) */

}