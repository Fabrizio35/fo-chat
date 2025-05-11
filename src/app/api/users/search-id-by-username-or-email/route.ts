import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/db'
import { ERRORS } from '@/constants/errors'

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
      return NextResponse.json(
        { message: `User ${ERRORS.NOT_FOUND}` },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
