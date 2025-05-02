import { z } from 'zod'

const validatePassword =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const registerSchema = z.object({
  email: z.string().email({ message: 'Ingresa un correo válido' }),
  username: z.string().min(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  }),
  password: z.string().regex(validatePassword, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  }),
  birthdate: z.coerce
    .date({
      required_error: 'Ingresa tu fecha de nacimiento',
      invalid_type_error: 'Fecha inválida',
    })
    .max(new Date(), {
      message: 'La fecha de nacimiento no puede ser futura',
    }),
})

export type RegisterFormData = z.infer<typeof registerSchema>
