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
      <h1>Task/Habit/Project: {task.name}</h1>
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

      <section className="flex flex-col gap-2 w-fit ">
        {logs.map(log => (
          <div
            key={log.id}
            className="flex bg-slate-600 gap-2 px-2 items-center"
          >
            <span>Date: {brDate(log.date)}</span>
            <span>Done: {log.doneAmount}</span>

            <ButtonIcon
              onClick={async () => {
                'use server'
                await _deleteTaskLog({ id: log.id })

                revalidatePath('/')
              }}
            >
              <AiFillDelete className="fill-red-500" />
            </ButtonIcon>
          </div>
        ))}
      </section>
      <footer className="bottom-0 right-0 absolute flex gap-8">
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
        />
      </footer>
    </div>
  )
}
