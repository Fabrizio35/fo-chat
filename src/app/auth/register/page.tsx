'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/schemas/register.schema'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { API_ROUTES, ROUTES } from '@/routes'
import { apiClient } from '@/apiClient'
import toast from 'react-hot-toast'

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      const response = await apiClient(API_ROUTES.AUTH.REGISTER, 'POST', data)

      const responseJSON = await response.json()

      if (response.ok && response.status === 201) {
        toast.success('Usuario creado correctamente')
        router.push(ROUTES.AUTH.LOGIN)
      } else {
        if (responseJSON.message === 'Email or username already exists')
          toast.error('El email o el nombre de usuario ya están registrados')
        else toast.error('Error al registrar usuario')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error de conexión, intenta nuevamente')
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2 items-center mt-5 max-w-sm mx-auto"
      >
        <h2 className="text-gray-900 font-semibold text-4xl">Registro</h2>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="username" className="text-slate-600">
            Nombre de usuario
          </label>

          <input
            id="username"
            type="text"
            placeholder="miUsuario123"
            autoComplete="username"
            {...register('username')}
            className="bg-slate-300 rounded-md p-1 border-[1px] border-slate-500 w-full"
          />

          {errors.username && (
            <span className="text-red-500 text-xs">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="email" className="text-slate-600">
            Correo
          </label>

          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            {...register('email')}
            className="bg-slate-300 rounded-md p-1 border-[1px] border-slate-500 w-full"
          />

          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="password" className="text-slate-600">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            placeholder="********"
            autoComplete="new-password"
            {...register('password')}
            className="bg-slate-300 rounded-md p-1 border-[1px] border-slate-500 w-full"
          />

          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="birthdate" className="text-slate-600">
            Fecha de nacimiento
          </label>

          <input
            type="date"
            id="birthdate"
            {...register('birthdate')}
            className="bg-slate-300 rounded-md p-1 border-[1px] border-slate-500 w-full"
          />
        </div>

        <button
          disabled={!isValid || isSubmitting}
          className="bg-blue-500 text-white py-1 rounded-md cursor-pointer w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  )
}
