import { SearchX } from 'lucide-react'
import type { Speaker } from '../data/speakers'
import { SpeakerCard } from './SpeakerCard'
import { Reveal } from './Reveal'

interface SpeakerGridProps {
  speakers: Speaker[]
  onOpen: (s: Speaker) => void
  onReset: () => void
}

export function SpeakerGrid({ speakers, onOpen, onReset }: SpeakerGridProps) {
  if (speakers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full border border-line bg-paper-2 text-muted">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-heading">No speakers found</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Try a different name, company or speaker type.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 cursor-pointer rounded-full border border-ink-200 px-6 py-2.5 text-sm font-semibold text-heading transition-colors hover:bg-paper-2"
        >
          Clear filters
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
      {speakers.map((s, i) => (
        <Reveal key={s.id} delay={Math.min(i, 8) * 45}>
          <SpeakerCard speaker={s} onOpen={onOpen} />
        </Reveal>
      ))}
    </div>
  )
}
