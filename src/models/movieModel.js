import { union } from 'zod';
import { prisma } from '../config/prismaClient.js'

export class MovieModel {

    static async getAll(filters) {
        const { where, limit, offset } = filters;

        const movies = await prisma.movie.findMany({
            where: where,
            select: {
                title: true,
                releaseYear: true,
                genres: true,
                runtime: true,
                creator: { select: { name: true } }
            },
            take: limit ? Number(limit) : undefined,  // limit
            skip: offset ? Number(offset) : undefined // offset
        });

        return movies.map(movie => ({
            ...movie,
            // Usamos ?. para evitar errores si creator es null
            createdBy: movie.creator?.name || 'Unknown', 
            creator: undefined 
        }));
}


    static async create(data) {
        const movie = await prisma.movie.create({
            data: data,
            include: {
                creator: {
                    select: {
                        name: true
                    }
                }
            }
        })

        movie.createdBy = movie.creator.name
        movie.creator = undefined
        return movie 
    }
}

/*  static async searchByTitle(title) {
        const movie = await prisma.movie.findFirst({
            where: { 
                title: {
                    equals: title,
                    mode: 'insensitive', // Realizar la busqueda sin importar minisculas y mayusculas.
                } 
            },
            select: {
                title: true,
                releaseYear: true,
                genres: true,
                creator: {
                    select: {
                        name: true
                    }
                }
            }
        })
        console.log('aqui llegue')
        movie.createdBy = movie.creator?.name // Ponemos el ? para verificar si esa propiedad existe
        movie.creator = undefined
        return movie
    } */