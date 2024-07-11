import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function brDate(date: Date, hours = false): string {
  if (!date) return ''
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  if (!hours) return `${day}/${month}/${year}`

  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')

  return `${day}/${month}/${year} - ${hour}:${minute}`
}

export function getDaysUntilNow(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatDateDiff(targetDate: Date): string {
  const currentDate = new Date()
  const diffInMilliseconds = targetDate.getTime() - currentDate.getTime()
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))

  if (diffInDays <= 0) {
    return 'Date has passed'
  }

  const years = Math.floor(diffInDays / 365)
  const months = Math.floor((diffInDays % 365) / 30)
  const days = diffInDays % 30

  let result = ''
  if (years > 0) {
    result += `${years} y${years > 1 ? '' : ''}`
    if (months > 0) result += ' '
  }
  if (months > 0) {
    result += `${months} month${months > 1 ? 's' : ''}`
    if (days > 0) result += ' '
  }
  if (days > 0 && years === 0 && months === 0) {
    result += `${days} day${days > 1 ? 's' : ''}`
  }

  // result += ' left'
  return result
}

export function predictCompletionDate({
  projectCompletionTarget,
  weeklyTarget,
  totalCompleted,
}: {
  totalCompleted: number
  projectCompletionTarget: number
  weeklyTarget: number
}) {
  const today = new Date()

  const trabalhoRestante = projectCompletionTarget - totalCompleted
  if (trabalhoRestante <= 0) {
    return today // Retorna a data de hoje se a meta já foi atingida
  }

  const howManyWeeks = trabalhoRestante / weeklyTarget

  // Calcula a data estimada de conclusão adicionando o número de semanas necessárias
  const endDate = new Date(
    today.getTime() + howManyWeeks * 7 * 24 * 60 * 60 * 1000
  )
  return endDate
}

export const getTrueWeekTarget = (
  taskCreatedDate: Date,
  taskWeeklyTarget: number
) => {
  const daysTaskHasBeenCreated = getDaysUntilNow(taskCreatedDate)
  if (daysTaskHasBeenCreated > 7) return taskWeeklyTarget
  return (taskWeeklyTarget / 7) * daysTaskHasBeenCreated
}
