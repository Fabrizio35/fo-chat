import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/libs/db'
import { ERRORS } from '@/constants/errors'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: ERRORS.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const { receiverId } = await req.json()

    const senderId = session.user.id

    if (!receiverId) {
      return NextResponse.json(
        { message: 'Receiver ID is required' },
        { status: 400 }
      )
    }

    const existingRequest = await prisma.chatRequest.findFirst({
      where: {
        senderId,
        receiverId,
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { message: 'Request already sent' },
        { status: 400 }
      )
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        participants: {
          some: { userId: senderId },
        },
        AND: {
          participants: {
            some: { userId: receiverId },
          },
        },
      },
    })

    if (existingChat) {
      return NextResponse.json(
        { message: 'Chat already exists between users' },
        { status: 400 }
      )
    }

    const request = await prisma.chatRequest.create({
      data: {
        senderId,
        receiverId,
      },
    })

    return NextResponse.json(request, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
