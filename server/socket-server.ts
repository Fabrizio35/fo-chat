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

    io.to(chatId).emit('newMessage', message)
  })

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})
