import { create } from 'zustand'
import { apiClient } from '@/apiClient'
import { API_ROUTES } from '@/routes'

type User = {
  id: string
  username: string
  email: string
}

type Chat = {
  id: string
  participants: {
    user: User
  }[]
}

type ChatStore = {
  chats: Chat[]
  loading: boolean
  fetchChats: () => Promise<void>
  setChats: (chats: Chat[]) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  loading: false,

  fetchChats: async () => {
    set({ loading: true })
    try {
      const res = await apiClient(API_ROUTES.CHATS.GET_BY_USER_ID, 'GET')

      if (!res.ok) throw new Error('Error al cargar los chats')

      const data = await res.json()

      set({ chats: data })
    } catch (error) {
      console.error(error)
    } finally {
      set({ loading: false })
    }
  },

  setChats: (chats) => set({ chats }),
}))
