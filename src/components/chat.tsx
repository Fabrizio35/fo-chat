'use client'
import { useEffect, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'

interface Message {
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
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>('')

  const socket = useSocket()

  const handleSend = () => {
    if (newMessage.trim() === '') return

    socket.emit('sendMessage', {
      chatId,
      senderId: userId,
      content: newMessage,
    })

    setNewMessage('')
  }

  useEffect(() => {
    socket.emit('joinChat', chatId)

    socket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off('newMessage')
    }
  }, [chatId, socket])

  return (
    <div className="p-4">
      <div className="mb-4 h-64 overflow-y-auto border">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.authorId === userId ? 'Yo' : 'Otro'}:</strong>{' '}
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleSend}
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

export default ChatRoom
