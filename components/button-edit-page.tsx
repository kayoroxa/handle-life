'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

export default function ButtonEditPage() {
  const pathUrl = usePathname()
  const isEdit = pathUrl?.includes('/edit')
  const newPathUrl = isEdit ? pathUrl.replace('/edit', '') : pathUrl + '/edit'

  return (
    <Button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      type="button"
    >
      <Link href={newPathUrl}>{isEdit ? 'Okay' : 'Editar'}</Link>
    </Button>
  )
}
