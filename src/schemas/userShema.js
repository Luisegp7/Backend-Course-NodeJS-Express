import * as z from 'zod'

/* const passwordSchema = z.string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número"); */

const baseUserSchema = z.object({
    email: z.email({error: 'Formato erroneo.'})
    .max(255),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.')
})

export const registerSchema = baseUserSchema.extend({
    name: z.string({error: 'Tiene que ser una cadena de caracteres.'})
    .min(3, 'El nombre tiene que tener al menos 3 caracteres.')
    .max(100, 'El nombre puede tener maximo 100 caracteres.')
    .trim()
    .toLowerCase(),
})

export const loginSchema = baseUserSchema
export const userSchema = registerSchema.strict()
export const partialUserSchema = registerSchema.partial().strict()
