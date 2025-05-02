'use client'
import { signOut, useSession } from 'next-auth/react'

const LogoutButton: React.FC = () => {
  const session = useSession()

  console.log(session)

  return (
    <div>
      <button onClick={() => signOut()} className="bg-blue-500 text-white p-2">
        Cerrar sesión
      </button>
    </div>
  )
}

export default LogoutButton
