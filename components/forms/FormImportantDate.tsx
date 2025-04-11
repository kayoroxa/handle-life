'use client'

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }).max(40),
  date: z.coerce.date({ required_error: 'Date is required.' }),
  color: z.string().optional(),
})

export default function FormImportantDate({
  onSubmit,
  defaultValues,
}: {
  defaultValues?: z.infer<typeof formSchema>
  onSubmit: (values: z.infer<typeof formSchema>) => void
}) {
  return (
    <AutoForm
      formSchema={formSchema}
      values={defaultValues}
      fieldConfig={{
        name: {
          label: 'Event Name',
        },
        date: {
          label: 'Event Date',
        },
        color: {
          label: 'Color (hex)',
          description: 'Optional color for the countdown (e.g. #3b82f6)',
        },
      }}
      onSubmit={onSubmit}
    >
      <AutoFormSubmit>Save Date</AutoFormSubmit>
    </AutoForm>
  )
}
