import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/libs/db'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'example@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '********',
        },
      },
      async authorize(credentials, _req) {
        const userFound = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        })

        if (!userFound) throw new Error('No user found')

        const matchPassword = await bcrypt.compare(
          credentials?.password as string,
          userFound.password
        )

        if (!matchPassword) throw new Error('Incorrect password')

        return {
          id: userFound.id,
          name: userFound.username,
          email: userFound.email,
        }
      },
    }),
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
