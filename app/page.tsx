interface CardSideProps {
  titulo: string
}

function CardSide({ titulo }: CardSideProps) {
  return <div className="">{titulo}</div>
}

export default function Home() {
  return (
    <div className="flex w-full bg-gray-700 min-h-full">
      <aside className="min-w-[100px] p-4 bg-gray-600 flex flex-col">
        <CardSide titulo="Hábitos" />
      </aside>
      <main className="flex-1 p-4 bg-gray-700 flex flex-col gap-6">
        <section className="w-full bg-gray-600 p-4 rounded-lg">
          Avatar: 🤖
        </section>
        <section className="w-full bg-gray-600 p-4 rounded-lg">
          <h1>Hábitos:</h1>
        </section>
      </main>
    </div>
  )
}
