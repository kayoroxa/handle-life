'use server'

import { prisma } from '@/lib/prisma'
import { ImportantDate } from '@prisma/client'
import { getServerSession } from 'next-auth'

export async function _createImportantDate({
  name,
  date,
  color,
  userEmail,
}: {
  name: string
  date: Date
  color?: string
  userEmail: string
}) {
  return prisma.importantDate.create({
    data: {
      name,
      date,
      color,
      user: {
        connect: {
          email: userEmail,
        },
      },
    },
  })
}

export async function _getImportantDates({
  email,
}: {
  email?: string
} = {}) {
  const session = await getServerSession()
  email = email || session?.user?.email || undefined

  if (!email) return []

  return prisma.importantDate.findMany({
    where: {
      user: {
        email,
      },
    },
    orderBy: {
      date: 'asc',
    },
  })
}

export async function _deleteImportantDate({
  id,
}: {
  id: ImportantDate['id']
}) {
  return prisma.importantDate.delete({
    where: {
      id,
    },
  })
}

export async function _updateImportantDate({
  id,
  data,
}: {
  id: ImportantDate['id']
  data: Partial<ImportantDate>
}) {
  return prisma.importantDate.update({
    where: {
      id,
    },
    data,
  })
}
