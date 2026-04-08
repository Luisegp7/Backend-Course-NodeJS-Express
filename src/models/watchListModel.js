import { id } from "zod/locales"
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
    
    static async create (userId) {
        const watchList = await prisma.watchlistItem.create({
            data: {
                userId: userId,
                movieId: 'aad03500-31a1-471c-b282-a37d14a5ef2b',
                status: 'PLANNED',
                rating: 7
            }
        })

        return watchList
    }
}