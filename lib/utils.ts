import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDaysUntilNow(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const getTrueWeekTarget = (
  taskCreatedDate: Date,
  taskWeeklyTarget: number
) => {
  const daysTaskHasBeenCreated = getDaysUntilNow(taskCreatedDate)
  if (daysTaskHasBeenCreated > 7) return taskWeeklyTarget
  return (taskWeeklyTarget / 7) * daysTaskHasBeenCreated
}
