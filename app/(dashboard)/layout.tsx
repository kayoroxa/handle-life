import SideBar from '@/components/SideBar'
import { getServerSession } from 'next-auth'
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { getUserData } from '../actions'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  if (!session || !session?.user?.email) {
    redirect('/login')
  }

  const user = await getUserData({ email: session?.user?.email })

  console.log({ user, email: session?.user?.email })
  if (user?.blocked || !user) {
    signOut({ callbackUrl: '/login', redirect: true })
    redirect('/login')
  }

  // const publicRoutes = ['/login', '/signup', '/public']

  // let cookieUserId = cookies().get('logged_user_id')?.value

  // if (!cookieUserId) {
  //   return redirect('/login')
  // }

  // const user = await getUserData({ userId: Number(cookieUserId) })

  // if (!user) {
  //   return redirect('/login')
  // }

  // query pesquisa

  interface CardSideProps {
    titulo: string
  }

  function CardSide({ titulo }: CardSideProps) {
    return <div className="">{titulo}</div>
  }

  return (
    <div className="flex w-full bg-gray-700 min-h-full">
      <SideBar
        userName={user?.name || ''}
        userImgUrl={user?.imgUrl || undefined}
      >
        <CardSide titulo="Hábitos" />
      </SideBar>

      <main className="bg-gray-800/60 flex-1">{children}</main>
    </div>
  )
}
