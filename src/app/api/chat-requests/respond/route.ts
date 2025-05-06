import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/libs/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { requestId, action } = await req.json()

    const userId = session.user.id

    const chatRequest = await prisma.chatRequest.findUnique({
      where: { id: requestId },
    })

    if (!chatRequest) {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      )
    }

    if (chatRequest.receiverId !== userId) {
      return NextResponse.json(
        { message: 'Unauthorized action' },
        { status: 403 }
      )
    }

    if (action === 'accept') {
      const updatedRequest = await prisma.chatRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      })

      const chat = await prisma.chat.create({
        data: {
          participants: {
            create: [
              { userId: chatRequest.senderId },
              { userId: chatRequest.receiverId },
            ],
          },
        },
      })

      await prisma.chatRequest.delete({
        where: { id: requestId },
      })

      return NextResponse.json({ chat, updatedRequest }, { status: 200 })
    }

    if (action === 'reject') {
      const updatedRequest = await prisma.chatRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
      })

      await prisma.chatRequest.delete({
        where: { id: requestId },
      })

      return NextResponse.json(updatedRequest, { status: 200 })
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
