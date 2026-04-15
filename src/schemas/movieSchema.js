import * as z from 'zod'

export const movieSchema = z.object({
    title: z
    .string({ error: 'El titulo debe contener solo caracteres'})
    .min(1, 'El titulo debe tener al menos un caracter.')
    .max(255, 'El titulo debe tener maximo 255 caracteres.')
    .trim(),
    overview: z.string().trim().optional(),
    releaseYear: z
    .number( {invalid_type_error: "Debe ser un número"})
    .int()
    .min(1900, 'Tiene que ser un numero mayor a 1900.')
    .max(2030, 'Tiene que ser un numero menor a 2030.'),
    genres: z.array(
        z.enum(['action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance', 'thriller',  'animation', 'adventure', 'fantasy', 'documentary', 'musical', 'western'],
        { error: 'El genero no es valido.' })
    )
    .default([]),
    runtime: z.number().int().positive().optional(),
    posterUrl: z
    .string()
    .url({ message: 'El formato de la url no es valido.' })
    .refine((url) => {
      return /\.(jpg|jpeg|png|webp)$/i.test(url);
    }, {
      message: "La URL debe terminar en .jpg, .jpeg, .png o .webp"
    })
    .optional(),
    createdBy: z.string().uuid()
})


export const movieQuerySchema = z.object({
  title: z
    .string({ error: 'El titulo debe contener solo caracteres'})
    .optional(),
  releaseYear: z
  .coerce.number( {invalid_type_error: "Debe ser un número"})
  .int()
  .min(1900, 'Tiene que ser un numero mayor a 1900.')
  .max(2030, 'Tiene que ser un numero menor a 2030.')
  .optional(),
  genres: z.preprocess((val) => {
    if (!val) return undefined;
    if (Array.isArray(val)) return val;
    // Convierte "action,comedy" en ["action", "comedy"]
    return val.toString().split(',').map(item => item.trim()); 
  }, 
    z.array(
      z.enum(
        ['action', 'comedy', 'crime' ,'drama', 'horror', 'sci-fi', 'romance', 'thriller', 'animation', 'adventure', 'fantasy', 'documentary', 'musical', 'western'],
        {
          errorMap: () => ({ message: 'El genero no es valido.' })
        }
      )
    ).optional()
  ),
  runtime: z
  .coerce.number('Tiene que ser un numero')
  .int('El numero debe ser entero')
  .positive('El numero debe ser positivo')
  .optional(),
  createdBy: z.string().optional(),
  pageSize: z.coerce
  .number({ invalid_type_error: 'Tiene que ser un número' })
  .int('Tiene que ser entero')
  .positive('Tiene que ser positivo')
  .default(10),
  /* offset: z.coerce
  .number({ invalid_type_error: 'Tiene que ser un número' })
  .int('Tiene que ser entero')
  .nonnegative('Tiene que ser positivo')
  .default(0), */
  sort: z
  .enum(['asc', 'ASC', 'desc', 'DESC'],
    {
      errorMap: () => ({ message: 'El valor no es valido.' })
    })
  .optional(),
  page: z.coerce
  .number({ invalid_type_error: 'Tiene que ser un número' })
  .int('Tiene que ser numero entero')
  .positive('Tiene que ser numero igual a 1 o mayor')
  .default(1)
})

