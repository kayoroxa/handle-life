import { prisma } from '@/lib/prisma'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler: NextAuthOptions = NextAuth({
  pages: {
    signIn: '/login',
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'seu_email@exemplo.com',
        },
        // password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null

        const { email } = credentials

        const user = await prisma.user.findFirst({
          where: {
            email,
            blocked: false,
          },
        })

        if (user) {
          console.log(credentials)

          return {
            id: String(user.id),
            email,
            name: user.name,
          }
        }
        return null
      },
    }),
  ],
  // callbacks: {
  //   session({ session, user }) {
  //     if (session.user) {
  //       session.user.id = user.id
  //       return session
  //     }

  //     return session
  //   },
  // },
})

export { handler as GET, handler as POST }
