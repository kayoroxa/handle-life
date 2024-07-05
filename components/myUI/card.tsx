'use client'

import { useState } from 'react'

function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-black/20 text-white p-2 rounded-md">
      {children}
    </button>
  )
}

interface IProps {
  data: {
    values: number[]
    label: string
  }
}

function ButtonsTime({ data }: IProps) {
  return (
    <section className="flex gap-6">
      {data.values.map((value, index) => (
        <Button key={index}>
          <p>{value}</p>
          <p>{data.label}</p>
        </Button>
      ))}
    </section>
  )
}

function Velocity({ percent }: { percent: number }) {
  return (
    <div className="flex gap-[0.2] h-4 bg-slate-100 p-[1px] rounded-sm relative">
      <div
        id="needle"
        className="h-[130%] -top-[2px] w-[2px] bg-black absolute rounded-full"
        style={{ left: `${percent * 100}%` }}
      />
      <div className="bg-red-500 w-6 h-full rounded-sm border border-white" />
      <div className="bg-red-400 w-6 h-full rounded-sm border border-white" />
      <div className="bg-yellow-400 w-6 h-full rounded-sm border border-white" />
      <div className="bg-green-500 w-6 h-full rounded-sm border border-white" />
      <div className="bg-green-400 w-6 h-full rounded-sm border border-white" />
    </div>
  )
}

export default function Card({ children }: { children?: React.ReactNode }) {
  const [percent, setPercent] = useState(0.25)
  return (
    <div className="w-full rounded-lg p-4 bg-red-400 text-white flex gap-4">
      <section className="flex flex-col">
        <div>💵</div>
        <h3>25%</h3>
      </section>
      <section className="flex flex-col gap-4">
        <h2>Novo Canal</h2>
        <Velocity percent={percent} />
      </section>
      <ButtonsTime data={{ values: [5, 10, 15, 20], label: 'dias' }} />
      <section className="ml-auto">
        <Button>...</Button>
      </section>
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
