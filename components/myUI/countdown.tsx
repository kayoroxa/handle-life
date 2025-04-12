'use client'

import { useEffect, useState } from 'react'

export function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate))
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!hasMounted) return null // impede renderização antes da montagem no client

  function calculateTimeLeft(targetDate: Date) {
    const difference = targetDate.getTime() - new Date().getTime()

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: true,
      }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    }
  }

  return (
    <div className="flex gap-4 text-center">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{timeLeft.days}</span>
        <span className="text-xs">days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{timeLeft.hours}</span>
        <span className="text-xs">hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{timeLeft.minutes}</span>
        <span className="text-xs">minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{timeLeft.seconds}</span>
        <span className="text-xs">seconds</span>
      </div>
      {timeLeft.isPast && <span className="text-red-500">(Passed)</span>}
    </div>
  )
}
