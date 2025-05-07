'use client'
import { useEffect } from 'react'
import { useChatStore } from '@/store/chatStore'
import { useRouter } from 'next/navigation'

const ChatList: React.FC = () => {
  const { chats, fetchChats, loading } = useChatStore()

  const router = useRouter()

  const openChat = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-3">Tus chats</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : chats.length === 0 ? (
        <p>No tienes ningún chat aún.</p>
      ) : (
        <ul className="space-y-3">
          {chats.map((chat) => (
            <li key={chat.id} className="border p-3 rounded">
              <p className="font-medium">
                Participantes:{' '}
                {chat.participants.map((p) => p.user.username).join(', ')}
              </p>

              <button
                onClick={() => openChat(chat.id)}
                className="text-blue-500 underline"
              >
                Abrir chat
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ChatList
