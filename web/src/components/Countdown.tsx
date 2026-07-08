import { useEffect, useState } from 'react'

const TARGET = new Date('2026-10-27T09:00:00-04:00').getTime()

function diff() {
  const total = Math.max(0, TARGET - Date.now())
  return {
    Days: Math.floor(total / 86_400_000),
    Hrs: Math.floor((total / 3_600_000) % 24),
    Min: Math.floor((total / 60_000) % 60),
    Sec: Math.floor((total / 1000) % 60),
  }
}

export function Countdown() {
  const [t, setT] = useState(diff)

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = Object.entries(t)

  return (
    <div className="flex items-end gap-3 sm:gap-4">
      {units.map(([label, value], i) => (
        <div key={label} className="flex items-end gap-3 sm:gap-4">
          <div className="flex w-16 flex-col items-center rounded-2xl border border-white/10 bg-white/5 py-3 shadow-sm backdrop-blur-md sm:w-18">
            <span className="font-display text-3xl font-bold tabular-nums leading-none text-white sm:text-4xl">
              {String(value).padStart(2, '0')}
            </span>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="pb-5 font-display text-2xl font-bold text-red-500/70">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
