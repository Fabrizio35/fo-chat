import { createServer } from 'http'
import { Server } from 'socket.io'
import { prisma } from '../src/libs/db'
import dotenv from 'dotenv'
import { ERRORS } from '@/constants/errors'
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/types/socket-events'
import jwt from 'jsonwebtoken'

interface DecodedToken {
  id: string
  email: string
  username: string
  birthdate: string
  createdAt: string
  updatedAt: string
}

dotenv.config()

const PORT = process.env.SOCKET_PORT || 3001

const httpServer = createServer()

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) return next(new Error(ERRORS.UNAUTHORIZED))

  try {
    const secret = process.env.NEXTAUTH_SECRET

    if (!secret) throw new Error('NEXTAUTH_SECRET is not defined')

    const decoded = jwt.verify(token, secret) as DecodedToken

    socket.data.user = decoded

    return next()
  } catch (error) {
    console.error(error)
    next(new Error(ERRORS.UNAUTHORIZED))
  }

  next()
})

io.on('connection', (socket) => {
  console.log('Usuario conectado', socket.id)

  socket.on('joinChat', (chatId) => {
    socket.join(chatId)
    console.log(`Usuario ${socket.id} se unió al chat ${chatId}`)
  })

  socket.on('sendMessage', async ({ chatId, senderId, content }) => {
    const userId = socket.data.user.id

    if (senderId !== userId) return

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
