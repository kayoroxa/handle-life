import { _createImportantDate } from '@/app/actions-dates'
import FormImportantDate from '@/components/forms/FormImportantDate'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function CreateImportantDate() {
  const session = await getServerSession()
  const email = session?.user?.email

  if (!email) return <div>Not authenticated</div>

  return (
    <div className="p-4 flex flex-col gap-6">
      <h1 className="text-2xl">Add Important Date</h1>

      <FormImportantDate
        onSubmit={async values => {
          'use server'
          await _createImportantDate({
            ...values,
            userEmail: email,
          })
          revalidatePath('/')
          redirect('/')
        }}
      />
    </div>
  )
}
