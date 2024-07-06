'use server'

import { prisma } from '@/lib/prisma'
import { Task, User } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getUserData({
  userId,
  email,
}: {
  userId?: User['id']
  email?: User['email']
} = {}) {
  const session = await getServerSession()
  email = email || session?.user?.email || undefined

  if (!userId && !email) {
    redirect('/login')
    return null
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        email,
      },
    })

    return user
  } catch (error) {
    redirect('/login')
    console.error(error)
    return null
  }
}

export async function serverLogin({ email }: { email: string }) {
  if (!email) return false
  const user = await getUserData({ email })

  const hasAuth = user
  if (!hasAuth) {
    cookies().delete('logged_user_id')
    return false
  }

  cookies().set('logged_user_id', String(user.id))

  redirect('/')
}

export async function _modifyTask({
  taskId,
  data,
}: {
  taskId: Task['id']
  data: Partial<Task>
}) {
  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  })

  return task
}

export async function _getTask({ taskId }: { taskId: Task['id'] }) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  })

  return task
}

export async function _getTasks({ email }: { email?: string }) {
  const session = await getServerSession()
  email = email || session?.user?.email || undefined

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  let tasks = await prisma.task.findMany({
    where: {
      user: {
        email,
      },
    },
    include: {
      taskLogs: true,
      // taskLogs: {
      //   where: {
      //     date: {
      //       gte: sevenDaysAgo,
      //     },
      //   },
      // },
    },
  })

  const getTotalCompletedLast7Days = (task: (typeof tasks)[0]) => {
    const lastLogs7Days = task.taskLogs.filter(log => {
      return log.date >= sevenDaysAgo
    })
    const taskCompletedLast7Days = lastLogs7Days.reduce((taskSum, log) => {
      return taskSum + log.doneAmount // Supondo que há um campo `doneAmount` no TaskLog para indicar o progresso diário
    }, 0)
    return taskCompletedLast7Days
  }

  const tasksData = tasks.map(task => {
    const totalCompleted = task.taskLogs.reduce((taskSum, log) => {
      return taskSum + log.doneAmount
    }, 0)

    const totalCompletedLast7Days = parseFloat(
      getTotalCompletedLast7Days(task).toFixed(2)
    )

    const percent = totalCompleted / task.projectCompletionTarget

    return {
      ...task,
      totalCompletedLast7Days,
      lastDoneDate: task.taskLogs[0]?.date || new Date(),
      totalCompleted,
      percent,
    }
  })

  return tasksData
}

export async function _deleteTask({ id }: { id: Task['id'] }) {
  try {
    await prisma.task.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export async function _cleanTaskLogs({ taskId }: { taskId: Task['id'] }) {
  return Promise.all([
    prisma.taskLog.deleteMany({
      where: {
        taskId,
      },
    }),

    prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        totalCompleted: 0,
        percent: 0,
        isDone: false,
      },
    }),
  ])
}

export async function _createTask({
  name,
  percent,
  weeklyTarget,
  projectCompletionTarget,
  unitSmallLabel,
  unitBigLabel,
  userEmail,
}: {
  name: string
  projectCompletionTarget: number
  percent: number
  unitSmallLabel?: string
  unitBigLabel?: string
  weeklyTarget: number
  userEmail: string
}) {
  const task = await prisma.task.create({
    data: {
      name,
      percent,
      weeklyTarget,
      projectCompletionTarget,

      user: {
        connect: {
          email: userEmail,
        },
      },
      unitBigLabel,
      unitSmallLabel,

      // Incluir outras propriedades obrigatórias do modelo Task
      totalCompleted: 0, // ou outro valor inicial apropriado
      lastDoneDate: new Date(), // ou outro valor inicial apropriado
    },
  })

  return task
}

export async function _addDoneAmountInTask({
  taskId,
  doneAmount,
}: {
  taskId: Task['id']
  doneAmount: number
}) {
  const number = parseFloat(doneAmount.toFixed(2))
  if (number === 0) return

  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  const existingLog = await prisma.taskLog.findFirst({
    where: {
      taskId: taskId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })

  if (existingLog) {
    await prisma.taskLog.update({
      where: { id: existingLog.id },
      data: {
        doneAmount: {
          increment: number,
        },
      },
    })
  } else {
    await prisma.taskLog.create({
      data: {
        date: new Date(),
        taskId: taskId,
        doneAmount: parseFloat(number.toFixed(2)),
      },
    })
  }
}
