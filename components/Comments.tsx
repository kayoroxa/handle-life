'use client'

import { CommentData } from '@/app/actions'
import { Comments } from './ui/comments'

interface Props {
  data: CommentData
  onComment: (comment: { text: string }) => void
  className: string
}

export function MyComments({ data, onComment, className }: Props) {
  return <Comments data={data} onComment={onComment} className={className} />
}
