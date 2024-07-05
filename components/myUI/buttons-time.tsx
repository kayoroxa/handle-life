'use client'

import Link from 'next/link'
import { IoIosMore } from 'react-icons/io'

interface IProps {
  data: {
    values: number[]
    label: string
    onClick?: (value: number) => void
  }
}

export function ButtonsTime({ data }: IProps) {
  return (
    <section className="flex gap-3 items-center">
      {data.values.map((value, index) => (
        <button
          key={index}
          onClick={() => data.onClick?.(value)}
          className="bg-black/10 text-white p-2 rounded-md text-center h-fit hover:bg-black/20"
        >
          <p className="text-xs -mt-1">+{value}</p>
          <p className="text-xs -mt-1">{data.label}</p>
        </button>
      ))}
    </section>
  )
}

export function MoreOptions({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="ml-auto flex items-center justify-center hover:bg-black/10 rounded-full w-10 h-10"
    >
      <IoIosMore className="hover:cursor-pointer" />
    </Link>
  )
}
