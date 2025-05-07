import LogoutButton from '@/components/LogoutButton'
import SendChatRequestForm from '@/components/SendChatRequestForm'
import ReceivedChatRequestsList from '@/components/ReceivedChatRequestsList'
import ChatList from '@/components/chats/ChatList'

export default async function Home() {
  return (
    <div>
      HOME
      <LogoutButton />
      <SendChatRequestForm />
      <ReceivedChatRequestsList />
      <ChatList />
    </div>
  )
}
