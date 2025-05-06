'use client'
import { useState, useEffect } from 'react'
import { apiClient } from '@/apiClient'
import { API_ROUTES } from '@/routes'
import toast from 'react-hot-toast'

type ChatRequest = {
  id: string
  sender: {
    id: string
    username: string
    email: string
  }
  createdAt: string
}

const ReceivedChatRequestsList: React.FC = () => {
  const [requests, setRequests] = useState<ChatRequest[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchRequests = async () => {
    setLoading(true)

    try {
      const res = await apiClient(API_ROUTES.CHAT_REQUESTS.RECEIVED, 'GET')

      if (!res.ok) throw new Error('Error al cargar las solicitudes')

      const data = await res.json()

      setRequests(data)
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error('No se pudieron cargar las solicitudes')
    } finally {
      setLoading(false)
    }
  }

  const respondToRequest = async (
    requestId: string,
    action: 'accept' | 'reject'
  ) => {
    try {
      const res = await apiClient(API_ROUTES.CHAT_REQUESTS.RESPOND, 'POST', {
        requestId,
        action,
      })

      if (!res.ok) throw new Error('Error al responder la solicitud')

      const msg =
        action === 'accept' ? 'Solicitud aceptada' : 'Solicitud rechazada'

      toast.success(msg)

      fetchRequests()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error('Error al procesar la solicitud')
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-3">Solicitudes recibidas</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : requests.length === 0 ? (
        <p>No tienes solicitudes pendientes.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li
              key={req.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{req.sender.username}</p>
                <p className="text-sm text-gray-500">{req.sender.email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => respondToRequest(req.id, 'accept')}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => respondToRequest(req.id, 'reject')}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReceivedChatRequestsList
