import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/db'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/schemas/register.schema'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { email, username, password } = data

    // We check that no data is missing
    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 })
    }

    // We check that the data is correct
    const parsedData = registerSchema.safeParse(data)

    if (!parsedData.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsedData.error.format() },
        { status: 400 }
      )
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10)

    // Search for a user who already has the username or email
    const userFound = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (userFound) {
      return NextResponse.json(
        { message: 'Email or username already exists' },
        { status: 400 }
      )
    }

    // Create the user if everything is correct
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    })

    const { password: _, ...user } = newUser

    return NextResponse.json(
      { newUser: user, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
