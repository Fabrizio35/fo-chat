import { z } from 'zod'

const validatePassword =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Email o nombre de usuario es requerido'),
  password: z.string().regex(validatePassword, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  }),
})

export type LoginFormData = z.infer<typeof loginSchema>
