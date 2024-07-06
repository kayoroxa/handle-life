import { prisma } from '@/lib/prisma'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Define a wrapper function to adapt NextApiRequest to NextRequest
const adaptRequest = req => {
  // You may need to adapt this according to your specific needs
  const adaptedReq = req // Adapt this as needed
  return adaptedReq
}

// Define the NextAuth configuration
const options = {
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
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { email } = credentials

        const user = await prisma.user.findFirst({
          where: {
            email,
            blocked: false,
          },
        })

        if (user) {
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
}

// Create the handler function using NextAuth with the adapted request
const handler = (req, res) => NextAuth(adaptRequest(req), res, options)

// Export the handler for different HTTP methods
export { handler as GET, handler as POST }
