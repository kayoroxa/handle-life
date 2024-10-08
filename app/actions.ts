'use server'

import { prisma } from '@/lib/prisma'
import {
  getDaysUntilNow,
  getPercentVelocity,
  getTrueWeekTarget,
} from '@/lib/utils'
import { Task, TaskLog, User } from '@prisma/client'
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

export type _GetTasks = Awaited<ReturnType<typeof _getTasks>>

export async function _getTasks({
  email,
  getArchived,
}: {
  email?: string
  getArchived?: boolean
}) {
  const session = await getServerSession()
  email = email || session?.user?.email || undefined

  let tasks = await prisma.task.findMany({
    where: {
      user: {
        email,
      },
      archived: getArchived ? undefined : false,
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

  const getTotalCompletedLastHistoryDays = (task: (typeof tasks)[0]) => {
    const historyDays =
      task.historyDays === 0
        ? getDaysUntilNow(task.createdAt)
        : task.historyDays // "7 days"

    // if (task.historyDays > 7) debugger

    console.log('historyDays', historyDays)

    let sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - historyDays)

    const lastLogs7Days = task.taskLogs.filter(log => {
      if (sevenDaysAgo < task.createdAt) {
        return log.date >= task.createdAt
      }
      return log.date >= sevenDaysAgo
    })
    const taskCompletedLastHistoryDays = lastLogs7Days.reduce(
      (taskSum, log) => {
        return taskSum + log.doneAmount // Supondo que há um campo `doneAmount` no TaskLog para indicar o progresso diário
      },
      0
    )
    return taskCompletedLastHistoryDays
  }

  const tasksData = tasks.map(task => {
    const totalCompleted = task.taskLogs.reduce((taskSum, log) => {
      return taskSum + log.doneAmount
    }, 0)

    const totalCompletedLastHistoryDays = parseFloat(
      getTotalCompletedLastHistoryDays(task).toFixed(2)
    )

    const percent = totalCompleted / task.projectCompletionTarget

    const newTask = {
      ...task,
      totalCompletedLastHistoryDays,
      lastDoneDate: task.taskLogs[0]?.date || new Date(),
      ofensiva:
        totalCompletedLastHistoryDays /
        getTrueWeekTarget(task.createdAt, task.weeklyTarget, task.historyDays),
      totalCompleted,
      historyDays:
        task.historyDays === 0
          ? getDaysUntilNow(task.createdAt)
          : task.historyDays,
      percent,
    }

    newTask.ofensiva = getPercentVelocity(newTask)

    return newTask
  })

  return tasksData
}

export async function _getTaskLogs({ taskId }: { taskId: Task['id'] }) {
  return prisma.taskLog.findMany({
    where: {
      taskId,
    },
    orderBy: {
      date: 'desc',
    },

    take: 10,
  })
}

export async function _deleteTaskLog({ id }: { id: TaskLog['id'] }) {
  try {
    await prisma.taskLog.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    console.error(error)
  }
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
        createdAt: new Date(),
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
  additionalLink,
  icon,
  historyDays,
  isBad,
}: {
  name: string
  projectCompletionTarget: number
  percent: number
  unitSmallLabel?: string
  unitBigLabel?: string
  weeklyTarget: number
  historyDays: number
  userEmail: string
  additionalLink?: string
  icon?: string
  isBad?: boolean
}) {
  const task = await prisma.task.create({
    data: {
      name,
      percent,
      weeklyTarget,
      historyDays,
      projectCompletionTarget,
      additionalLink,
      user: {
        connect: {
          email: userEmail,
        },
      },
      unitBigLabel,
      unitSmallLabel,
      icon,
      isBad,

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

  await prisma.task.update({
    where: { id: taskId },
    data: {
      totalCompleted: {
        increment: number,
      },
    },
  })

  await prisma.taskLog.create({
    data: {
      date: new Date(),
      taskId: taskId,
      doneAmount: parseFloat(number.toFixed(2)),
    },
  })

  // const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  // const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  // const existingLog = await prisma.taskLog.findFirst({
  //   where: {
  //     taskId: taskId,
  //     date: {
  //       gte: startOfDay,
  //       lte: endOfDay,
  //     },
  //   },
  // })

  // if (existingLog) {
  //   await prisma.taskLog.update({
  //     where: { id: existingLog.id },
  //     data: {
  //       doneAmount: {
  //         increment: number,
  //       },
  //     },
  //   })
  // } else {
  //   await prisma.taskLog.create({
  //     data: {
  //       date: new Date(),
  //       taskId: taskId,
  //       doneAmount: parseFloat(number.toFixed(2)),
  //     },
  //   })
  // }
}
