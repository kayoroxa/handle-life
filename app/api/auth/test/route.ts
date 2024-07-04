import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let userId = cookies().get('logged_user_id')?.value
    if (!userId)
      return new NextResponse(
        JSON.stringify({ user: null, auth: false, noCookie: true })
      )

    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    })
    return new NextResponse(JSON.stringify({ user, auth: true }))
  } catch (error) {
    console.error(error)
    return new NextResponse(
      JSON.stringify({ error: 'Erro ao buscar dados do usuário' })
    )
  }
}
