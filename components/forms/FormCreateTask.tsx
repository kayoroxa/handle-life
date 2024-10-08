'use client'
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form'
import { formatDateDiff, predictCompletionDate } from '@/lib/utils'
import { useState } from 'react'
import * as z from 'zod'

/*

model Task {
  id                      Int       @id @default(autoincrement())
  name                    String
  weeklyTarget            Float
  projectCompletionTarget Float
  percent                 Float     @default(0)
  isDone                  Boolean   @default(false)
  totalCompleted          Float     @default(0)
  lastDoneDate            DateTime  @default(now())
  user                    User      @relation(fields: [userId], references: [id])
  userId                  Int       @map("user_id")
  taskLogs                TaskLog[]
  notes                   String?

  categories Category[] // Relacionamento para múltiplas categorias
}

*/

// Define your form schema using zod
const formSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }).max(40, {
    message: 'Name must be less than 40 characters.',
  }),
  projectCompletionTarget: z.coerce.number({
    required_error: 'Project completion target is required.',
  }),
  weeklyTarget: z.coerce.number({
    required_error: 'Weekly target is required.',
  }),
  historyDays: z.coerce.number({ required_error: 'History days is required.' }),
  unitBigLabel: z
    .string({ required_error: 'Unit big label is required.' })
    .max(10),
  unitSmallLabel: z
    .string({ required_error: 'Unit small label is required.' })
    .max(10),
  additionalLink: z.string().optional(),
  archived: z.boolean().default(false).optional(),
  icon: z.string().optional(),
  isBad: z.boolean().default(false).optional(),
})

export default function FormCreateTask({
  onSubmit,
  defaultValues,
  submitText = 'Send Now!',
}: {
  defaultValues?: z.infer<typeof formSchema>
  onSubmit: (values: z.infer<typeof formSchema>) => void
  submitText?: string
}) {
  const [disabled, setDisabled] = useState(false)
  const [stateValues, setValues] = useState<
    Partial<z.infer<typeof formSchema>>
  >(defaultValues || {})

  return (
    <AutoForm
      onSubmit={values => {
        onSubmit(values)
        setDisabled(true)
      }}
      onValuesChange={values => {
        setDisabled(false)
        setValues(values)
      }}
      values={defaultValues}
      // Pass the schema to the form
      formSchema={formSchema}
      // You can add additional config for each field
      // to customize the UI
      fieldConfig={{
        projectCompletionTarget: {
          label: 'Project completion target (BIG UNIT)',
        },
        weeklyTarget: {
          label: 'Weekly target (BIG UNIT)',
          description: stateValues.weeklyTarget && (
            <div>
              <p className="text-gray-500 text-sm">
                It means at day:{' '}
                {parseFloat((stateValues.weeklyTarget / 7).toFixed(2))}
              </p>

              <p className="text-gray-400 text-sm">
                or: {Math.round((stateValues.weeklyTarget / 7) * 60)} min per
                day
              </p>
              <p>
                <span>Complete in </span>
                <span className="text-gray-400">
                  {formatDateDiff(
                    predictCompletionDate({
                      projectCompletionTarget:
                        stateValues.projectCompletionTarget || 0,
                      weeklyTarget: stateValues.weeklyTarget || 0,
                      totalCompleted: 0,
                    })
                  )}
                </span>
              </p>
            </div>
          ),
        },
        historyDays: {
          label: 'History days (LAST X DAYS)',
          description: (
            <div>
              Number of days to display the task completion history. Exemple:
              last 7 days.{' '}
              <b className="text-yellow-300/30">
                (If you put 0 it will show all days.)
              </b>
            </div>
          ),
        },
        unitSmallLabel: {
          label: 'Unit small label (Label to show in buttons actions)',
          description: 'Recommended: min',
        },
        unitBigLabel: {
          description: 'Recommended: hours',
        },
        archived: {
          label: 'Archive Task 📂',
        },
        additionalLink: {
          label: 'Additional Link (Optional)',
          description: 'Exemplo: link notion, docs, etc...',
        },
        isBad: {
          label: 'Is this task bad? 🚫',
        },

        // sendMeMails: {
        //   // Booleans use a checkbox by default, you can use a switch instead
        //   fieldType: 'switch',
        // },
      }}
    >
      {/* 
      Pass in a AutoFormSubmit or a button with type="submit".
      Alternatively, you can not pass a submit button
      to create auto-saving forms etc.
      */}
      <AutoFormSubmit
        disabled={disabled}
        className="bg-green-600 hover:bg-green-700"
      >
        {submitText}
      </AutoFormSubmit>

      {/*
      All children passed to the form will be rendered below the form.
      */}
      {/* <p className="text-gray-500 text-sm">
        By submitting this form, you agree to our{' '}
        <a href="#" className="text-primary underline">
          terms and conditions
        </a>
        .
      </p> */}
    </AutoForm>
  )
}
