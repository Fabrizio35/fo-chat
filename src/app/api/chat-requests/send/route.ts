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
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
