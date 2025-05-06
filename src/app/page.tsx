import LogoutButton from '@/components/LogoutButton'
import SendChatRequestForm from '@/components/SendChatRequestForm'
import ReceivedChatRequestsList from '@/components/ReceivedChatRequestsList'

export default async function Home() {
  return (
    <div>
      HOME
      <LogoutButton />
      <SendChatRequestForm />
      <ReceivedChatRequestsList />
    </div>
  )
}
