'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '../ui/button'

export default function DeleteButton({ onClick }: { onClick: () => void }) {
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
        'bg-red-400 absolute bottom-0 right-0 hover:bg-red-500 transition-all',
        countClick === 1 && 'bg-red-600 scale-75 hover:bg-red-700'
      )}
    >
      {countClick == 0 && 'Delete'}
      {countClick == 1 && 'Click again to delete'}
    </Button>
  ) : (
    <div className="absolute bottom-0 right-0">Okay, Carregando!</div>
  )
}
