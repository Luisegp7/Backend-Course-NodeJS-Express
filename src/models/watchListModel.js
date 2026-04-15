import { prisma } from "../config/prismaClient.js"

export class WatchListModel {
    
    static async getByUser (userId){
        const watchList = await prisma.watchlistItem.findMany({
            where: {
                userId: userId
            },
            select: {
                user: {
                    select: {
                        name: true
                    }
                },
                status: true,
                rating: true,
                movie: {
                    select: {
                        title: true,
                        overview: true,
                        releaseYear: true,
                        genres: true,
                        runtime: true
                    }
                }
            }
        })

        return watchList
    }
    
    static async create (userId, data) {
        const watchList = await prisma.watchlistItem.create({
            data: {
                userId: userId,
                movieId: data.movieId,
                status: data.status ?? 'PLANNED',
                rating: data.rating,
                notes: data.notes
            }
        })

        return watchList
    }

    static async findByUserAndMovie(userId, movieId) {
        const watchListItem = await prisma.watchlistItem.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId
                }
            }
        })

        return watchListItem
    }
}