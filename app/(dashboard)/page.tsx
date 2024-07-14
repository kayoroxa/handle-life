import { IoCalendarNumberOutline } from 'react-icons/io5'

import Card, { getColorByPercent } from '@/components/myUI/card'
import { Button } from '@/components/ui/button'
import {
  brDate,
  cn,
  formatDateDiff,
  getDaysUntilNow,
  getPercentVelocity,
  getTrueWeekTarget,
  predictCompletionDate,
} from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { IoMdArchive } from 'react-icons/io'
import { _addDoneAmountInTask, _GetTasks, _getTasks } from '../actions'

function roundFloat(value: number, precision: number = 2) {
  return parseFloat(value.toFixed(precision))
}

function getLabelWeek(taskCreatedDate: Date) {
  const daysTaskHasBeenCreated = getDaysUntilNow(taskCreatedDate)
  if (daysTaskHasBeenCreated > 7) return 'Week'
  if (daysTaskHasBeenCreated === 1) return 'Today'
  return 'Last ' + daysTaskHasBeenCreated + ' days'
}

function getWeeklyText(task: _GetTasks[number]) {
  const today = roundFloat(task.totalCompletedLast7Days)
  const target = roundFloat(
    getTrueWeekTarget(task.createdAt, task.weeklyTarget),
    2
  )

  if (
    task.unitSmallLabel.toLowerCase() === 'min' &&
    (today < 1 || target < 1)
  ) {
    return `${roundFloat(today * 60, 0)} / ${roundFloat(target * 60, 0)} min`
  }

  if (task.unitSmallLabel.toLowerCase() === 'min') {
    return `${today} / ${target} hours`
  }

  return `${today} / ${target} ${task.unitBigLabel.toLowerCase()}`
}

function getLeftDays(task: _GetTasks[number]) {
  return formatDateDiff(
    predictCompletionDate({
      projectCompletionTarget: task.projectCompletionTarget,
      totalCompleted: task.totalCompleted,
      weeklyTarget: task.weeklyTarget,
    })
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: { showArchives: 'true' | 'false'; rawDate: 'true' | 'false' }
}) {
  const session = await getServerSession()
  const email = session?.user?.email

  if (!email) return <div>Email not found</div>

  const tasks = (
    await _getTasks({
      email,
      getArchived: searchParams.showArchives === 'true',
    })
  ).sort((a, b) => {
    return a.ofensiva - b.ofensiva
  })

  async function handleButtonsTimeClick(value: number, taskId: number) {
    'use server'
    // console.log(value)

    await _addDoneAmountInTask({
      taskId: taskId,
      doneAmount: value / 60,
    })

    revalidatePath('/')
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <section className="w-full bg-gray-600 p-4 rounded-lg">
        Avatar: 🤖
      </section>
      <section className="w-full bg-gray-600 p-4 rounded-lg flex flex-col gap-4">
        <header className="flex gap-4 items-center">
          <h1>Hábitos/Tasks:</h1>

          <Link href="/task/create">
            <Button>Create Habit/Task</Button>
          </Link>
          <aside className="ml-auto flex gap-4">
            <Link
              href={searchParams.rawDate === 'true' ? '/' : '/?rawDate=true'}
              className={cn(
                'bg-primary px-3 py-2 rounded-lg hover:bg-primary/80',
                searchParams.rawDate === 'true'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : ''
              )}
            >
              <IoCalendarNumberOutline className="scale-125" />
            </Link>

            <Link
              href={
                searchParams.showArchives === 'true'
                  ? '/'
                  : '/?showArchives=true'
              }
              className={cn(
                'bg-primary px-3 py-2 rounded-lg hover:bg-primary/80',
                searchParams.showArchives === 'true'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : ''
              )}
            >
              <IoMdArchive className="scale-125" />
            </Link>
          </aside>
        </header>

        {tasks.map(task => (
          <div key={task.id} className="relative rounded-lg overflow-hidden">
            <Card
              className={cn(
                'z-10',
                getColorByPercent(getPercentVelocity(task)),
                task.archived ? 'opacity-40' : ''
              )}
            >
              {/* <div
              className="bg-blue-400 absolute left-0 bottom-0 pb-[50%]"
              style={{
                width: 100 * 2 * (task.percent / 100) + '%',
              }}
            ></div> */}

              <section className="flex flex-col w-12">
                <div>{task.icon || ''}</div>
                <h3>{roundFloat(task.percent * 100)}%</h3>
              </section>
              <section className="flex flex-col gap-1">
                <h2 className="w-48 max-w-48 text-ellipsis">{task.name}</h2>

                <Card.Velocity percent={getPercentVelocity(task)} />
              </section>
              <Card.ButtonsTime
                data={{
                  values: [1, 2, 3, 4, 5, 10, 15, 30],
                  label: task.unitSmallLabel,
                  onClick: async (value: number) => {
                    'use server'
                    await handleButtonsTimeClick(value, task.id)
                  },
                }}
              />
              <table className="">
                <thead className="text-base">
                  <tr className="text-left">
                    <th className="w-[170px] font-medium">
                      {getLabelWeek(task.createdAt)}:
                    </th>
                    <th className="w-[170px] font-medium">total:</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td>{getWeeklyText(task)}</td>
                    <td>
                      {roundFloat(task.totalCompleted)} /{' '}
                      {roundFloat(task.projectCompletionTarget)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <section className="ml-auto flex gap-2 items-center">
                {searchParams.rawDate === 'true' ? (
                  <span>{brDate(predictCompletionDate(task))}</span>
                ) : (
                  <span>{getLeftDays(task)} left</span>
                )}
                <div className="w-6">
                  {task.additionalLink && (
                    <Card.UrlButton href={task.additionalLink} />
                  )}
                </div>
                <Card.MoreOptions href={`/task/${task.id}`} />
              </section>
              <div
                className={cn(
                  'absolute left-0 bottom-0 rounded-tr-full -z-10 shadow-black/80 shadow-2xl',
                  getColorByPercent(getPercentVelocity(task), 'light')
                )}
                style={{ width: 100 * task.percent + '%' }}
              >
                <div className="pb-[100%]"></div>
              </div>
            </Card>
          </div>
        ))}
      </section>
    </div>
  )
}
