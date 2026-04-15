import { start } from "repl";
import { startsWith } from "zod";

export const movieFilterParams = ({ title, releaseYear, genres, runtime, createdBy, pageSize, offset, sort, page }) => {
    let where = {}
    let orderBy = {}

    if (title) {
        where.title = {
            startsWith: title,
            mode: 'insensitive'
        };
    }

    if (releaseYear) {
        where.releaseYear = {
            equals: Number(releaseYear)
        }
    }

    if (genres) {
        // Si usas el middleware con Zod que discutimos, 'genre' ya debería ser un array.
        // Pero mantenemos esta lógica por seguridad:
        const genreArray = Array.isArray(genres) ? genres : genres.split(',');
        console.log('Estoy dentro del if', genres)

        const normalizeGenre = genreArray.map((g) => g.trim().toLowerCase())
        /* const normalizeGenre = genreArray.map((g) => {
            const trimmed = g.trim()
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
        }) */

        where.genres = {
            hasSome : normalizeGenre
        }
    }

    if (runtime) {
        where.runtime = {
            gte: Number(runtime)
        }
    }

    if (createdBy) {
        // Para filtrar por el nombre del creador (relación)
        where.creator = {
            name: {
                startsWith: createdBy,
                mode: 'insensitive'
            }
        }
    }

    if (sort && (sort === 'asc' || sort === 'ASC')) {
        orderBy = {releaseYear: 'asc'}
    }

    if (sort && (sort === 'desc' || sort === 'DESC')) {
        orderBy = {releaseYear: 'desc'}
    }


    return { where, pageSize, page, orderBy }

}