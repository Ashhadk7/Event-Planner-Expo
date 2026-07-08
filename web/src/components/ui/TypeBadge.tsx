import { SPEAKER_TYPE_STYLES, type SpeakerType } from '../../data/speakerTypes'

interface TypeBadgeProps {
  type: SpeakerType
  size?: 'sm' | 'md'
  className?: string
}

/** White pill + coloured dot — reads cleanly over a photo and on white. */
export function TypeBadge({ type, size = 'sm', className = '' }: TypeBadgeProps) {
  const { color } = SPEAKER_TYPE_STYLES[type]
  const sizing =
    size === 'sm' ? 'text-[10px] px-2.5 py-1 gap-1.5' : 'text-[11px] px-3 py-1.5 gap-2'
  return (
    <span
      className={`inline-flex items-center rounded-full bg-white font-semibold uppercase tracking-[0.12em] text-heading shadow-sm ring-1 ring-black/5 ${sizing} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {type}
    </span>
  )
}
