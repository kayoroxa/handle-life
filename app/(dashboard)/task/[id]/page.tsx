import {
  _cleanTaskLogs,
  _deleteTask,
  _getTask,
  _modifyTask,
} from '@/app/actions'
import FormCreateTask from '@/components/forms/FormCreateTask'
import DeleteButton from '@/components/myUI/delete-button'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function Home({ params }: { params: { id: string } }) {
  const task = await _getTask({ taskId: Number(params.id) })

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
        }}
        submitText="Okay, Edit Task!"
      />
      <footer className="bottom-0 right-0 absolute flex gap-8">
        <DeleteButton
          title="Reset Progress"
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
