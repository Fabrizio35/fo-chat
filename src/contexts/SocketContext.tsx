'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const PORT = process.env.NEXT_PUBLIC_SOCKET_PORT || 3001

const SOCKET_URL = `http://localhost:${PORT}`

const SocketContext = createContext<Socket | null>(null)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io(SOCKET_URL)

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
