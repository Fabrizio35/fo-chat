'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/types/socket-events'
import { useSession } from 'next-auth/react'

const PORT = process.env.NEXT_PUBLIC_SOCKET_PORT! || 3001

const SOCKET_URL = `http://localhost:${PORT}`

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

const SocketContext = createContext<TypedSocket | null>(null)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<TypedSocket | null>(null)

  const { data } = useSession()

  useEffect(() => {
    const socketInstance: TypedSocket = io(SOCKET_URL, {
      auth: { token: data?.accessToken },
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Error de conexión al WebSocket:', error)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  const socket = useContext(SocketContext)

  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider')
  }

  return socket
}
