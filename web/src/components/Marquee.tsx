interface MarqueeProps {
  items: string[]
}

/** Seamless marquee of notable names — quiet ink on the light ground. */
export function Marquee({ items }: MarqueeProps) {
  const row = [...items, ...items]
  return (
    <div className="marquee-mask relative overflow-hidden py-4">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-lg font-semibold tracking-tight text-ink-700/30">
              {item}
            </span>
            <span className="text-sm text-gold-500">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
