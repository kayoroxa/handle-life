import Card from '@/components/myUI/card'

export default function Home() {
  return (
    <div className="p-4 flex flex-col gap-6">
      <section className="w-full bg-gray-600 p-4 rounded-lg">
        Avatar: 🤖
      </section>
      <section className="w-full bg-gray-600 p-4 rounded-lg">
        <h1>Hábitos:</h1>

        <Card></Card>
      </section>
    </div>
  )
}
