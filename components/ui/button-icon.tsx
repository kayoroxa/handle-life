'use client'

import { cn } from '@/lib/utils'

export default function ButtonIcon({
  onClick,
  children,
  className,
}: {
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'hover:bg-white rounded-full hover:cursor-pointer',
        className
      )}
      onClick={() => {
        onClick()
      }}
    >
      {children}
    </div>
  )
}
