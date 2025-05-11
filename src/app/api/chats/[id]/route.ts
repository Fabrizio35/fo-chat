import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/libs/db'
import { ERRORS } from '@/constants/errors'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: ERRORS.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const chatId = params.id

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!chat) {
      return NextResponse.json(
        { message: `Chat ${ERRORS.NOT_FOUND}` },
        { status: 401 }
      )
    }

    const isParticipant = chat.participants.some(
      (p) => p.user.id === session.user.id
    )

    if (!isParticipant) {
      return NextResponse.json({ message: ERRORS.FORDBIDDEN }, { status: 403 })
    }

    return NextResponse.json(chat, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
