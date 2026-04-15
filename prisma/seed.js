import 'dotenv/config'
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPg({ connectionString})

const prisma = new PrismaClient({ adapter })

const userId = '90a0caac-c61d-4d8d-9f3c-943fc99e617f'

const movies = [
  {
    title: "The Matrix",
    overview: "A computer hacker learns about the true nature of reality.",
    releaseYear: 1999,
    genres: ["action", "sci-fi"],
    runtime: 136,
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3Y9S7q2MvYSRnZ9rjs1BhUv.jpg",
    createdBy: userId,
  },
  {
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology.",
    releaseYear: 2010,
    genres: ["action", "adventure", "sci-fi"],
    runtime: 148,
    posterUrl: "https://image.tmdb.org/t/p/w500/oSR999M6YI8SQU07u4ZAsCHm1CH.jpg",
    createdBy: userId,
  },
  {
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
    releaseYear: 2008,
    genres: ["action", "crime", "drama"],
    runtime: 152,
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDr9p1v3urnn9XNbp9e.jpg",
    createdBy: userId,
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    genres: ["adventure", "drama", "sci-fi"],
    runtime: 169,
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    createdBy: userId,
  },
  {
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine.",
    releaseYear: 1994,
    genres: ["crime", "drama"],
    runtime: 154,
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlSXY9C1uP7s5zRqbne9XUot.jpg",
    createdBy: userId,
  },
  {
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    genres: ["drama"],
    runtime: 142,
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsYKoBbtuou1Al47ZpIs.jpg",
    createdBy: userId,
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    releaseYear: 2023,
    genres: ["animation", "action", "adventure"],
    runtime: 140,
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8SbsN0Yjn6S0fyVB0X0Pq0v.jpg",
    createdBy: userId,
  },
  {
    title: "Parasite",
    overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseYear: 2019,
    genres: ["comedy", "drama", "thriller"],
    runtime: 132,
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTj0nS2sZ36P6a9TS7sCcSb6.jpg",
    createdBy: userId,
  },
  {
    title: "Gladiator",
    overview: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    releaseYear: 2000,
    genres: ["action", "adventure", "drama"],
    runtime: 155,
    posterUrl: "https://image.tmdb.org/t/p/w500/ty8TGRpSxcwa3u61oPsgvX7MREI.jpg",
    createdBy: userId,
  },
  {
    title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    releaseYear: 2024,
    genres: ["action", "adventure", "sci-fi"],
    runtime: 166,
    posterUrl: "https://image.tmdb.org/t/p/w500/czembW0R7UNcyD9vUlrV6B64vC6.jpg",
    createdBy: userId,
  },
  {
    title: "Spirited Away",
    overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
    releaseYear: 2001,
    genres: ["animation", "adventure", "family"],
    runtime: 125,
    posterUrl: "https://image.tmdb.org/t/p/w500/39wmItSpsS4rVKmGLQ2WvI0uz0w.jpg",
    createdBy: userId,
  },
  {
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseYear: 1972,
    genres: ["crime", "drama"],
    runtime: 175,
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrjSTmodule799XUuU0vIuKz6.jpg",
    createdBy: userId,
  },
  {
    title: "Fight Club",
    overview: "An insomniac office worker and a devil-may-care shoemaker form an underground fight club that evolves into something much, much more.",
    releaseYear: 1999,
    genres: ["drama"],
    runtime: 139,
    posterUrl: "https://image.tmdb.org/t/p/w500/pB8BjbPvov0mB90uQpGs9BhXESn.jpg",
    createdBy: userId,
  },
  {
    title: "The Silence of the Lambs",
    overview: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    releaseYear: 1991,
    genres: ["crime", "drama", "horror"],
    runtime: 118,
    posterUrl: "https://image.tmdb.org/t/p/w500/uS9mY7k9xS69Q77oN6vM00mY0Z.jpg",
    createdBy: userId,
  },
  {
    title: "Avengers: Endgame",
    overview: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",
    releaseYear: 2019,
    genres: ["action", "adventure", "sci-fi"],
    runtime: 181,
    posterUrl: "https://image.tmdb.org/t/p/w500/or06vS3STZviNEqQhp9Z3LpQMNB.jpg",
    createdBy: userId,
  },
  {
    title: "Whiplash",
    overview: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.",
    releaseYear: 2014,
    genres: ["drama", "music"],
    runtime: 107,
    posterUrl: "https://image.tmdb.org/t/p/w500/7u3U97S0T79HpxTSBNX9pru36CC.jpg",
    createdBy: userId,
  },
  {
    title: "Everything Everywhere All at Once",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes.",
    releaseYear: 2022,
    genres: ["action", "adventure", "sci-fi"],
    runtime: 139,
    posterUrl: "https://image.tmdb.org/t/p/w500/rKvCj0a70Xm96OEqoUkyLE9vCwc.jpg",
    createdBy: userId,
  },
  {
    title: "Mad Max: Fury Road",
    overview: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners.",
    releaseYear: 2015,
    genres: ["action", "adventure", "sci-fi"],
    runtime: 120,
    posterUrl: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbS_KI6t7vO6Sbiq.jpg",
    createdBy: userId,
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth.",
    releaseYear: 2001,
    genres: ["adventure", "fantasy", "action"],
    runtime: 178,
    posterUrl: "https://image.tmdb.org/t/p/w500/6oomAD9oMvWp0p6v9P9pIe0pS1P.jpg",
    createdBy: userId,
  },
  {
    title: "Coco",
    overview: "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather.",
    releaseYear: 2017,
    genres: ["animation", "family", "adventure"],
    runtime: 105,
    posterUrl: "https://image.tmdb.org/t/p/w500/gMBws2ydztcykbDYB6FLasCcbkO.jpg",
    createdBy: userId,
  }
  // ... Se pueden seguir añadiendo hasta completar las 250
];

const main = async () => {
    console.log('Seeding movies...')
    
    for (const movie of movies) {
        await prisma.movie.create({
            data: movie
        })
        console.log('Created movie:', movie.title)
    }
    console.log('Seeding completed!')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})