
export const movieFilterParams = ({ title, releaseYear, genres, runtime, createdBy, limit, offset }) => {
    let where = {}
    console.log(genres)

    if (title) {
        where.title = {
            contains: title, 
            mode: 'insensitive'
        };
    }

    if (releaseYear) {
        where.releaseYear = {
            equals: releaseYear
        }
    }

    if (genres) {
        // Si usas el middleware con Zod que discutimos, 'genre' ya debería ser un array.
        // Pero mantenemos esta lógica por seguridad:
        const genreArray = Array.isArray(genres) ? genres : genres.split(',');
        console.log('Estoy dentro del if', genres)

        const normalizeGenre = genreArray.map((g) => {
            const trimmed = g.trim()
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
        })

        where.genres = {
            hasSome : normalizeGenre
        }
    }

    if (runtime) {
        where.runtime = {
            lte: runtime
        }
    }

    if (createdBy) {
        // Para filtrar por el nombre del creador (relación)
        where.creator = {
            name: {
                contains: createdBy,
                mode: 'insensitive'
            }
        }
    }

    return { where, limit, offset }

}