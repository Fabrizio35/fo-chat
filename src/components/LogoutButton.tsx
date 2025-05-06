'use client'
import { signOut, useSession } from 'next-auth/react'

const LogoutButton: React.FC = () => {
  const session = useSession()

  return (
    <div className="flex flex-col items-center gap-2">
      <span>
        ¡Bienvenido{' '}
        <strong className="font-semibold">{session.data?.user.username}</strong>
        !
      </span>
      <button onClick={() => signOut()} className="bg-blue-500 text-white p-2">
        Cerrar sesión
      </button>
    </div>
  )
}

export default LogoutButton
