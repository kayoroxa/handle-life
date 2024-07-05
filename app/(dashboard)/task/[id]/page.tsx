import { _getTask, _modifyTask } from '@/app/actions'
import FormCreateTask from '@/components/forms/FormCreateTask'
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
        }}
        submitText="Okay, Edit Task!"
      />
    </div>
  )
}
