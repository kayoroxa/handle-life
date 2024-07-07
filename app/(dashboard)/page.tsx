import Card, { getColorByPercent } from '@/components/myUI/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { _addDoneAmountInTask, _GetTasks, _getTasks } from '../actions'

function roundFloat(value: number, precision: number = 2) {
  return parseFloat(value.toFixed(precision))
}

function getDaysUntilNow(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function brDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0') // Dia com zero à esquerda, se necessário
  const month = date.getMonth().toString().padStart(2, '0') // Mês com zero à esquerda, pois Janeiro é 0
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const getTrueWeekTarget = (taskCreatedDate: Date, taskWeeklyTarget: number) => {
  const daysTaskHasBeenCreated = getDaysUntilNow(taskCreatedDate)
  if (daysTaskHasBeenCreated > 7) return taskWeeklyTarget
  return (taskWeeklyTarget / 7) * daysTaskHasBeenCreated
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
    getTrueWeekTarget(task.createdAt, task.weeklyTarget)
  )

  if (
    task.unitSmallLabel.toLowerCase() === 'min' &&
    (today < 1 || target < 1)
  ) {
    return `${Math.round(today * 60)} / ${Math.round(target * 60)} min`
  }

  if (task.unitSmallLabel.toLowerCase() === 'min') {
    return `${today} / ${target} hours`
  }

  return `${today} / ${target} ${task.unitBigLabel.toLowerCase()}`
}

function predictCompletionDate(task: _GetTasks[number]): Date {
  const today = new Date()

  const trabalhoRestante = task.projectCompletionTarget - task.totalCompleted
  if (trabalhoRestante <= 0) {
    return today // Retorna a data de hoje se a meta já foi atingida
  }

  const weeklyTarget = task.weeklyTarget
  const howManyWeeks = trabalhoRestante / weeklyTarget

  // Calcula a data estimada de conclusão adicionando o número de semanas necessárias
  const endDate = new Date(
    today.getTime() + howManyWeeks * 7 * 24 * 60 * 60 * 1000
  )
  return endDate
}

export default async function Home() {
  const session = await getServerSession()
  const email = session?.user?.email

  if (!email) return <div>Email not found</div>

  const tasks = await _getTasks({ email })

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
        </header>

        {tasks.map(task => (
          <div key={task.id} className="relative rounded-lg overflow-hidden">
            <Card
              className={cn(
                'z-10',
                getColorByPercent(
                  task.totalCompletedLast7Days /
                    getTrueWeekTarget(task.createdAt, task.weeklyTarget)
                )
              )}
            >
              {/* <div
              className="bg-blue-400 absolute left-0 bottom-0 pb-[50%]"
              style={{
                width: 100 * 2 * (task.percent / 100) + '%',
              }}
            ></div> */}

              <section className="flex flex-col w-10">
                <div>💵</div>
                <h3>{roundFloat(task.percent * 100)}%</h3>
              </section>
              <section className="flex flex-col gap-1">
                <h2 className="w-48 max-w-48 text-ellipsis">{task.name}</h2>

                <Card.Velocity
                  percent={
                    task.totalCompletedLast7Days /
                    getTrueWeekTarget(task.createdAt, task.weeklyTarget)
                  }
                />
              </section>
              <Card.ButtonsTime
                data={{
                  values: [2, 5, 10, 15, 30, 60],
                  label: task.unitSmallLabel,
                  onClick: async (value: number) => {
                    'use server'
                    await handleButtonsTimeClick(value, task.id)
                  },
                }}
              />
              <div className="flex flex-col ">
                <h1>{getLabelWeek(task.createdAt)}:</h1>
                <h1>{getWeeklyText(task)}</h1>
              </div>
              <div className="flex flex-col ml-4">
                <h1>total:</h1>
                <h1>
                  {roundFloat(task.totalCompleted)} /{' '}
                  {roundFloat(task.projectCompletionTarget)}
                </h1>
              </div>
              <section className="ml-auto flex gap-2 items-center">
                <div>{brDate(predictCompletionDate(task))}</div>
                <Card.MoreOptions href={`/task/${task.id}`} />
              </section>
              <div
                className={cn(
                  'absolute left-0 bottom-0 rounded-tr-full -z-10 shadow-black/80 shadow-2xl',
                  getColorByPercent(
                    task.totalCompletedLast7Days /
                      getTrueWeekTarget(task.createdAt, task.weeklyTarget),
                    'light'
                  )
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
