import Card from '@/components/myUI/card'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { _addDoneAmountInTask, _getTasks } from '../actions'

export default async function Home() {
  const session = await getServerSession()
  const email = session?.user?.email

  if (!email) return <div>Email not found</div>

  const tasks = await _getTasks({ email })

  async function handleButtonsTimeClick(value: number, taskId: number) {
    'use server'
    console.log(value)

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
        <h1>Hábitos:</h1>

        {tasks.map(task => (
          <div key={task.id} className="relative rounded-lg overflow-hidden">
            <Card className="z-10">
              {/* <div
              className="bg-blue-400 absolute left-0 bottom-0 pb-[50%]"
              style={{
                width: 100 * 2 * (task.percent / 100) + '%',
              }}
            ></div> */}

              <section className="flex flex-col">
                <div>💵</div>
                <h3>{Math.round(task.percent * 100)}%</h3>
              </section>
              <section className="flex flex-col gap-1">
                <h2>{task.name}</h2>

                <Card.Velocity
                  percent={task.totalCompletedLast7Days / task.weeklyTarget}
                />
              </section>
              <Card.ButtonsTime
                data={{
                  values: [5, 10, 15, 2000],
                  label: 'min',
                  onClick: async () => {
                    'use server'
                    await handleButtonsTimeClick(5, task.id)
                  },
                }}
              />
              <div className="flex flex-col">
                <h1>week:</h1>
                <h1>
                  {task.totalCompleted} / {task.weeklyTarget}
                </h1>
              </div>
              <div className="flex flex-col ml-4">
                <h1>total:</h1>
                <h1>
                  {task.totalCompleted} / {task.projectCompletionTarget}
                </h1>
              </div>
              <Card.MoreOptions />
              <div
                className="absolute left-0 bg-blue-400 bottom-0 rounded-tr-full -z-10"
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
