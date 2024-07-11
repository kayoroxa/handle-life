import {
  _cleanTaskLogs,
  _deleteTask,
  _deleteTaskLog,
  _getTask,
  _getTaskLogs,
  _modifyTask,
} from '@/app/actions'
import FormCreateTask from '@/components/forms/FormCreateTask'
import DeleteButton from '@/components/myUI/delete-button'
import ButtonIcon from '@/components/ui/button-icon'
import { brDate } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AiFillDelete } from 'react-icons/ai'

export default async function Home({ params }: { params: { id: string } }) {
  const task = await _getTask({ taskId: Number(params.id) })
  const logs = await _getTaskLogs({ taskId: Number(params.id) })

  if (!task) return <div>Task not found</div>

  return (
    <div className="p-4 flex flex-col gap-6">
      <header className="flex">
        <h1 className="text-3xl">Task/Habit/Project: {task.name}</h1>
        <aside className="ml-auto flex gap-4">
          <DeleteButton
            title="Recomeçar essa task hoje"
            onClick={async () => {
              'use server'
              await _modifyTask({
                taskId: Number(params.id),
                data: {
                  createdAt: new Date(),
                },
              })

              revalidatePath('/')
              redirect('/')
            }}
          />

          <DeleteButton
            title="Reset All Progress"
            onClick={async () => {
              'use server'
              await _cleanTaskLogs({ taskId: task.id })
              revalidatePath('/')
              redirect('/')
            }}
          />

          <DeleteButton
            title="Delete Task"
            onClick={async () => {
              'use server'
              await _deleteTask({ id: task.id })
              revalidatePath('/')
              redirect('/')
            }}
          >
            <AiFillDelete className="fill-white" size={20} />
          </DeleteButton>
        </aside>
      </header>

      <FormCreateTask
        onSubmit={async values => {
          'use server'
          await _modifyTask({ taskId: Number(params.id), data: values })

          revalidatePath('/')
          redirect('/')
        }}
        defaultValues={{
          name: task.name,
          projectCompletionTarget: task.projectCompletionTarget,
          weeklyTarget: task.weeklyTarget,
          unitBigLabel: task.unitBigLabel,
          unitSmallLabel: task.unitSmallLabel,
          archived: task.archived,
          additionalLink: task.additionalLink || undefined,
          icon: task.icon || undefined,
        }}
        submitText="Okay, Edit Task!"
      />

      <table className="table-auto w-fit">
        <thead>
          <tr>
            <th>Date</th>
            <th>Done</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className=" bg-slate-600">
              <th className="py-3 px-4 font-normal">
                {brDate(log.date, true)}
              </th>
              <th className="py-3 px-4 font-normal">
                {task.unitSmallLabel.toLowerCase() === 'min'
                  ? Math.round(log.doneAmount * 60) + ' min'
                  : log.doneAmount}
              </th>

              <th className="py-3 px-4 ">
                <ButtonIcon
                  onClick={async () => {
                    'use server'
                    await _deleteTaskLog({ id: log.id })

                    revalidatePath('/')
                  }}
                >
                  <AiFillDelete className="fill-red-500" size={20} />
                </ButtonIcon>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="bottom-0 right-0 fixed p-4 flex gap-8"></footer>
    </div>
  )
}
