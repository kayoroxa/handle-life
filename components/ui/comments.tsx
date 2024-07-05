'use client'

import { CommentData } from '@/app/actions'
import { cn } from '@/lib/utils'
import { useRef } from 'react'
import { Button } from './button'
import { Input } from './input'

interface Props {
  data: CommentData
  onComment: (comment: { text: string }) => void
  className?: string
}

export function Comments({ data, onComment, className }: Props) {
  // const selectedCourseId = useSelectedStore(state => state.selectedCourseId)
  // const selectedLessonId = useSelectedStore(state => state.selectedLessonId)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleComment = () => {
    const text = inputRef.current?.value
    // if (!text || !selectedLessonId || !selectedCourseId) {
    //   throw new Error('Invalid input')
    // }
    if (!text) return

    onComment({
      text: text,
    })
    inputRef.current.value = '' // Clear input after submitting
  }

  return (
    <div className={cn('flex flex-col ', className)}>
      <h1 className="font-bold">Comments:</h1>

      <section className="flex gap-4 ">
        <Input
          type="text"
          className="bg-gray-700 text-white border-gray-400"
          placeholder="Seu comentário aqui..."
          ref={inputRef}
        />
        <Button onClick={handleComment}>Comentar</Button>
      </section>
      <ul className="flex flex-col gap-4 p-4 rounded-lg mt-4 min-h-[100px]">
        {data?.map((comment, index) => {
          return (
            <li
              key={index}
              className="flex flex-col gap-2 p-4 bg-gray-700 rounded-lg"
            >
              <div className="font-bold">{comment.authorName}</div>
              <div>{comment.text}</div>
            </li>
          )
        })}
        {data?.length === 0 && (
          <div className="font-bold">Seja o primeiro a comentar! :)</div>
        )}
      </ul>
    </div>
  )
}
