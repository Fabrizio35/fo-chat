interface Message {
  id: string
  chatId: string
  authorId: string
  content: string
  createdAt: string
  updatedAt: string
}

interface MessageProps {
  message: Message
  userId: string
}

const Message: React.FC<MessageProps> = ({ message, userId }) => {
  const hourFormat = () => {
    const hour = new Date(message.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    return hour
  }

  return (
    <div>
      <strong>{message.authorId === userId ? 'Yo' : 'Otro'}:</strong>{' '}
      {message.content}
      <span className="text-xs text-gray-400 ml-2">{hourFormat()}</span>
    </div>
  )
}

export default Message
