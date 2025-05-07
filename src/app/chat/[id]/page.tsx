import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ChatRoom from '@/components/chats/ChatRoom'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/routes'

interface Props {
  params: { id: string }
}

const ChatPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) redirect(ROUTES.AUTH.LOGIN)

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <ChatRoom chatId={params.id} userId={session.user.id} />
    </div>
  )
}

export default ChatPage
