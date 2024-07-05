import { cn } from '@/lib/utils'
import { IoIosMore } from 'react-icons/io'
import { ButtonsTime } from './buttons-time'

function Button({ children }: { children: React.ReactNode }) {
  return <button className="">{children}</button>
}

function Velocity({ percent }: { percent: number }) {
  return (
    <div className="flex gap-[0.2] h-4 bg-slate-100 w-fit p-[1px] rounded-sm relative">
      <div
        id="needle"
        className="h-[130%] -top-[2px] w-[2px] bg-black absolute rounded-full"
        style={{ left: `${Math.min(percent, 1) * 100}%` }}
      />
      <div className="bg-red-500 w-6 h-full rounded-sm border border-white" />
      <div className="bg-red-400 w-6 h-full rounded-sm border border-white" />
      <div className="bg-yellow-400 w-6 h-full rounded-sm border border-white" />
      <div className="bg-green-500 w-6 h-full rounded-sm border border-white" />
      <div className="bg-green-400 w-6 h-full rounded-sm border border-white" />
    </div>
  )
}

function MoreOptions() {
  return (
    <section className="ml-auto flex items-center">
      <IoIosMore className="hover:cursor-pointer" />
    </section>
  )
}

export default function Card({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-full rounded-lg py-2 px-4 bg-red-400 text-white flex gap-4 relative',
        className
      )}
    >
      {children}
    </div>
  )
  return (
    <div className="w-full rounded-lg py-2 px-4 bg-red-400 text-white flex gap-4">
      <section className="flex flex-col">
        <div>💵</div>
        <h3>25%</h3>
      </section>
      <section className="flex flex-col gap-1">
        <h2>Novo Canal</h2>
        <Velocity percent={0.5} />
      </section>
      <ButtonsTime data={{ values: [5, 10, 15, 20], label: 'min' }} />
      <MoreOptions />
      {children}
      {/* <input
        type="range"
        name=""
        id=""
        min={0}
        max={100}
        step={1}
        onChange={e => {
          setPercent(Number(e.target.value) / 100)
        }}
      /> */}
    </div>
  )
}

Card.Velocity = Velocity
Card.ButtonsTime = ButtonsTime
Card.MoreOptions = MoreOptions
