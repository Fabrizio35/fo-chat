'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiClient } from '@/apiClient'
import { API_ROUTES } from '@/routes'
import toast from 'react-hot-toast'

type FormData = {
  identifier: string
}

const SendChatRequestForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>()

  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async ({ identifier }: FormData) => {
    setLoading(true)

    try {
      const userRes = await apiClient(
        API_ROUTES.USERS.SEARCH_ID_BY_USERNAME_OR_EMAIL,
        'POST',
        {
          identifier,
        }
      )

      if (!userRes.ok) {
        const data = await userRes.json()
        throw new Error(data.message || 'User not found')
      }

      const user = await userRes.json()

      const requestRes = await apiClient(
        API_ROUTES.CHAT_REQUESTS.SEND,
        'POST',
        {
          receiverId: user.id,
        }
      )

      if (!requestRes.ok) {
        const data = await requestRes.json()
        if (data.message === 'Request already sent')
          throw new Error('La solicitud ya fue enviada')
        throw new Error(data.message || 'Error sending request')
      }

      toast.success('Solicitud enviada correctamente')
      reset()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto p-4 border rounded shadow"
    >
      <h2 className="text-lg font-semibold mb-3">Enviar solicitud de chat</h2>

      <input
        type="text"
        className="w-full p-2 border rounded mb-1"
        placeholder="Nombre de usuario o email"
        {...register('identifier', { required: 'Este campo es requerido' })}
      />
      {errors.identifier && (
        <p className="text-red-500 text-sm mb-2">{errors.identifier.message}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={loading || !isValid}
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}

export default SendChatRequestForm
