import { _getImportantDates, _updateImportantDate } from '@/app/actions-dates'
import FormImportantDate from '@/components/forms/FormImportantDate'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function EditImportantDate({
  params,
}: {
  params: { id: string }
}) {
  const dates = await _getImportantDates()
  const date = dates.find(d => d.id === Number(params.id))

  if (!date) return <div>Date not found</div>

  return (
    <div className="p-4 flex flex-col gap-6">
      <h1 className="text-2xl">Edit Important Date</h1>

      <FormImportantDate
        defaultValues={{
          name: date.name,
          date: date.date,
          color: date.color || undefined,
        }}
        onSubmit={async values => {
          'use server'
          await _updateImportantDate({
            id: date.id,
            data: values,
          })
          revalidatePath('/')
          redirect('/')
        }}
      />
    </div>
  )
}
