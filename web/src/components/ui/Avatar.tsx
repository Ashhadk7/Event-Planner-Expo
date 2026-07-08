import type { Speaker } from '../../data/speakers'

/** Deterministic deep-indigo gradients so placeholders vary but stay on-brand. */
const GRADIENTS = [
  'from-ink-600 via-ink-700 to-ink-900',
  'from-ink-500 via-ink-700 to-ink-800',
  'from-[#161c5e] via-ink-700 to-ink-900',
  'from-ink-700 via-ink-800 to-ink-900',
  'from-[#1b2170] via-ink-600 to-ink-800',
]

function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

interface AvatarProps {
  speaker: Speaker
  className?: string
  initialsClassName?: string
  /** Apply duotone (grayscale→colour on parent .group hover) to real photos */
  duotone?: boolean
}

export function Avatar({
  speaker,
  className = '',
  initialsClassName = 'text-6xl',
  duotone = true,
}: AvatarProps) {
  const initials = `${speaker.firstName[0] ?? ''}${speaker.lastName[0] ?? ''}`
  const gradient = GRADIENTS[hash(speaker.slug) % GRADIENTS.length]

  if (speaker.photoUrl) {
    return (
      <img
        src={speaker.photoUrl}
        alt={`${speaker.firstName} ${speaker.lastName}`}
        loading="lazy"
        className={`h-full w-full object-cover ${duotone ? 'duotone' : ''} ${className}`}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      {/* top sheen + gold whisper */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_-10%,rgba(255,255,255,0.14),transparent_65%)]" />
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(248,198,70,0.18),transparent_70%)]" />
      <span
        className={`font-display font-bold tracking-tight text-white/90 select-none ${initialsClassName}`}
      >
        {initials}
      </span>
    </div>
  )
}
