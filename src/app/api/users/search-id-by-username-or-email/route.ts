import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/db'

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json()

    if (!identifier) {
      return NextResponse.json(
        { message: 'Missing identifier' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
