interface SendMessagePayload {
  chatId: string
  senderId: string
  content: string
}

export interface ClientToServerEvents {
  joinChat: (chatId: string) => void
  sendMessage: (payload: SendMessagePayload) => void
}

export interface ServerToClientEvents {
  newMessage: (message: {
    id: string
    chatId: string
    authorId: string
    content: string
    createdAt: Date
    updatedAt: Date
    username: string
  }) => void
}
