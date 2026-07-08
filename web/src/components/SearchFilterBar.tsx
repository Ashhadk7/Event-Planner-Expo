import { Search, X } from 'lucide-react'
import { SPEAKER_TYPES, type SpeakerType } from '../data/speakerTypes'

type Filter = SpeakerType | 'All'

interface SearchFilterBarProps {
  query: string
  onQuery: (v: string) => void
  type: Filter
  onType: (v: Filter) => void
  counts: Record<string, number>
}

export function SearchFilterBar({ query, onQuery, type, onType, counts }: SearchFilterBarProps) {
  const chips: Filter[] = ['All', ...SPEAKER_TYPES]

  return (
    <div className="sticky top-18 z-30 border-y border-line bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1320px] px-5 py-4 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative lg:w-80 lg:shrink-0">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search by name or company…"
              aria-label="Search speakers by name or company"
              className="h-11 w-full rounded-full border border-line bg-paper-2 pl-11 pr-10 text-sm text-heading outline-none transition-colors duration-200 placeholder:text-muted focus:border-ink-300 focus:bg-white focus:ring-4 focus:ring-ink-700/5"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-heading"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
            {chips.map((chip) => {
              const active = type === chip
              const count = counts[chip] ?? 0
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onType(chip)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                    active
                      ? 'border-ink-700 bg-ink-700 text-white shadow-[0_10px_24px_-12px_rgba(0,4,72,0.55)]'
                      : 'border-line bg-white text-body hover:border-ink-300 hover:text-heading'
                  }`}
                >
                  {chip === 'All' ? 'All Speakers' : chip}
                  <span className={active ? 'text-white/70' : 'text-muted'}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
