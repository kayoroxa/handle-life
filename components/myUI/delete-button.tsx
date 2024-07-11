'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function DeleteButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void
  title?: string
  children?: React.ReactNode
}) {
  const [countClick, setCountClick] = useState(0)
  return countClick < 2 ? (
    <Button
      onClick={() => {
        setCountClick(prev => {
          if (prev + 1 >= 2) onClick()
          return prev + 1
        })
      }}
      className={cn(
        'bg-red-400  hover:bg-red-500 transition-all',
        countClick === 1 && 'bg-red-600 scale-75 hover:bg-red-700'
      )}
    >
      {countClick == 0 && (title || 'Delete')}
      {countClick == 1 && `Click again to ${title || 'Delete'}`}
      <div className="ml-2">{children}</div>
    </Button>
  ) : (
    <div className="">Okay, Carregando!</div>
  )
}
