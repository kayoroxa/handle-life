import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home({ params }: { params: { id: string } }) {
  return (
    <div className="p-4 flex flex-col gap-6">
      <h1>Hábito {params.id}</h1>
      <form action="" className="flex flex-col gap-4 w-fit ">
        <Input
          type="text"
          placeholder="Hábito Name"
          className="bg-slate-600 text-white"
        />
        <Button type="submit">Salvar</Button>
      </form>
    </div>
  )
}
