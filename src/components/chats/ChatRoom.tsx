'use client'
import { useEffect, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { apiClient } from '@/apiClient'
import toast from 'react-hot-toast'
import Message from './Message'

interface MessageType {
  id: string
  chatId: string
  authorId: string
  content: string
  createdAt: string
  updatedAt: string
}

interface ChatRoomProps {
  chatId: string
  userId: string
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId, userId }) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false)

  const socket = useSocket()

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true)
        const res = await apiClient(`/api/chats/${chatId}`)

        if (!res.ok) {
          throw new Error('Error al cargar los mensajes. Intenta de nuevo.')
        }

        const chat = await res.json()

        setMessages(chat.messages || [])
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
        else toast.error('No se pudieron cargar las solicitudes')
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [chatId])

  const handleSend = () => {
    if (newMessage.trim() === '') return

    setError(null)

    socket.emit(
      'sendMessage',
      {
        chatId,
        senderId: userId,
        content: newMessage,
      },
      (error: string | null) => {
        if (error) setError('Error al enviar el mensaje. Intenta de nuevo.')
        else setNewMessage('')
      }
    )

    setNewMessage('')
  }

  useEffect(() => {
    socket.emit('joinChat', chatId)

    socket.on('newMessage', (message: MessageType) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off('newMessage')
    }
  }, [chatId, socket])

  return (
    <div className="p-4">
      <div className="mb-4 h-64 overflow-y-auto border">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Cargando mensajes...
          </div>
        ) : (
          messages.map((msg) => (
            <Message key={msg.id} message={msg} userId={userId} />
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={newMessage}
          placeholder="Escribe un mensaje..."
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSend()
            }
          }}
          className="flex-1 border p-2"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleSend}
        >
          Enviar
        </button>
      </div>

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}

export default ChatRoom
