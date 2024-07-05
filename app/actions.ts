'use server'

import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getUserData({
  userId,
  email,
}: {
  userId?: User['id']
  email?: User['email']
} = {}) {
  const session = await getServerSession()
  email = email || session?.user?.email || undefined

  if (!userId && !email) {
    redirect('/login')
    return null
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        email,
      },
    })

    return user
  } catch (error) {
    redirect('/login')
    console.error(error)
    return null
  }
}

export async function serverLogin({ email }: { email: string }) {
  if (!email) return false
  const user = await getUserData({ email })

  const hasAuth = user
  if (!hasAuth) {
    cookies().delete('logged_user_id')
    return false
  }

  cookies().set('logged_user_id', String(user.id))

  redirect('/')
}
