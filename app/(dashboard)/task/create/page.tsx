import { _createTask } from '@/app/actions'
import FormCreateTask from '@/components/forms/FormCreateTask'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function Home({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  const email = session?.user?.email

  if (!email)
    return (
      <div>
        User Email not found, make a login to continue <a href="/login"></a>
      </div>
    )

  return (
    <div className="p-4 flex flex-col gap-6">
      <h1>Create Task/Habit/Project</h1>

      <FormCreateTask
        onSubmit={async values => {
          'use server'
          await _createTask({
            name: values.name,
            percent: 0,
            weeklyTarget: values.weeklyTarget,
            historyDays: 7,
            projectCompletionTarget: values.projectCompletionTarget,
            userEmail: email,
            unitBigLabel: values.unitBigLabel,
            unitSmallLabel: values.unitSmallLabel,
            additionalLink: values.additionalLink || undefined,
            icon: values.icon || undefined,
            isBad: values.isBad || false,
          })

          revalidatePath('/')
          redirect('/')
        }}
        defaultValues={{
          unitBigLabel: 'Hours',
          unitSmallLabel: 'Min',
          name: '',
          projectCompletionTarget: 1000,
          weeklyTarget: 5,
          icon: '💲',
          historyDays: 7,
        }}
        submitText="Okay, Create that Task!"
      />
    </div>
  )
}
