import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import LogoutButton from '@/components/LogoutButton'

export default async function Home() {
  const session = await getServerSession(authOptions)

  console.log(session?.user)

  return (
    <div>
      First commit
      <LogoutButton />
    </div>
  )
}
