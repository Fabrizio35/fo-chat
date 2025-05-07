import { createServer } from 'http'
import { Server } from 'socket.io'
import { prisma } from '../src/libs/db'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.SOCKET_PORT || 3001

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('Usuario conectado', socket.id)

  socket.on('joinChat', (chatId) => {
    socket.join(chatId)
    console.log(`Usuario ${socket.id} se unió al chat ${chatId}`)
  })

  socket.on('sendMessage', async ({ chatId, senderId, content }) => {
    const message = await prisma.message.create({
      data: {
        chatId,
        authorId: senderId,
        content,
      },
    })

    const user = await prisma.user.findUnique({ where: { id: senderId } })

    io.to(chatId).emit('newMessage', {
      id: message.id,
      chatId: message.chatId,
      authorId: message.authorId,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      username: user?.username || 'Desconocido',
    })
  })

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})
