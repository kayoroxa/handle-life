'use client'

import { ReactNode } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHandPeace } from 'react-icons/fa'
import { LoginAvatar } from './login-avatar'

function MyLink({ href, children }: any) {
  if (!href) return <>{children}</>
  return (
    <Link href={href} passHref className="w-full">
      {children}
    </Link>
  )
}

function ButtonHeader({
  children,
  active,
  notAble,
  href,
}: {
  children: ReactNode
  active?: boolean
  notAble?: boolean
  href?: string
}) {
  return (
    <Link
      href={href || '#'}
      className={`${
        active
          ? 'bg-gray-800 hover:cursor-default'
          : 'bg-gray-800/20 hover:bg-gray-800/30 hover:cursor-pointer'
      } ${
        notAble ? 'text-white text-opacity-30 hover:cursor-help' : ''
      } px-10 py-4 text-xl  rounded-l-3xl flex gap-5 items-center`}
    >
      {children}
    </Link>
  )
}

interface IProps {
  active?: 'inicio' | 'continuar'
  userName?: string
  children?: ReactNode
  userImgUrl?: string
}

export default function SideBar({
  userName,
  active = 'inicio',
  children,
  userImgUrl,
}: IProps) {
  const pathName = usePathname()

  return (
    <section className="bg-gray-700/90 rounded-r-[40px] py-8 max-w-sm flex flex-col gap-12 items-center h-full text-white">
      <Link className="bg-gray-800 px-6 py-3 hover:cursor-pointer" href={'/'}>
        HOME
      </Link>
      <header id="user-info" className="p-4 flex gap-4 items-center">
        <LoginAvatar imgUrl={userImgUrl} />
        <main>
          <h3>Hello,</h3>
          <div className="relative w-max flex gap-2">
            <h1 className="text-3xl font-bold">{userName}</h1>
            <span className="-mt-6 text-3xl bottom-0 flex items-end">
              <FaHandPeace />
            </span>
          </div>
        </main>
      </header>
      <main>{children}</main>
    </section>
  )
}
