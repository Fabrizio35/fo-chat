'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/schemas/login.schema'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/routes'
import toast from 'react-hot-toast'

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      const response = await signIn('credentials', {
        email: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (response?.error) {
        if (response.error === 'No user found')
          toast.error('No se encuentra un usuario con ese email')

        if (response.error === 'Incorrect password')
          toast.error('Contraseña incorrecta')
      } else router.push(ROUTES.HOME)
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
        <h2 className="text-gray-900 font-semibold text-4xl">
          Inicio de sesión
        </h2>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="email" className="text-slate-600">
            Email o nombre de usuario
          </label>

          <input
            id="identifier"
            type="text"
            placeholder="Email o nombre de usuario"
            autoComplete="username"
            {...register('identifier')}
            className="bg-slate-300 rounded-md p-1 border-[1px] border-slate-500 w-full"
          />

          {errors.identifier && (
            <span className="text-red-500 text-xs">
              {errors.identifier.message}
            </span>
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

        <button
          disabled={!isValid || isSubmitting}
          className="bg-blue-500 text-white py-1 rounded-md cursor-pointer w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
