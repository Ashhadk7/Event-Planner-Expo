import type { ReactNode } from 'react'

interface SectionHeaderProps {
  kicker: string
  title: ReactNode
  className?: string
}

/** Editorial header: red tick · uppercase kicker · oversized slab title. */
export function SectionHeader({ kicker, title, className = '' }: SectionHeaderProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-red-500" />
        <span className="kicker text-muted">{kicker}</span>
      </div>
      <h2 className="display-section mt-4 text-balance text-heading">{title}</h2>
    </div>
  )
}
