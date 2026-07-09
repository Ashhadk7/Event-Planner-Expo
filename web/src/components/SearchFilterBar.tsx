import { Search, X } from 'lucide-react'

interface SearchFilterBarProps {
  query: string
  onQuery: (v: string) => void
}

export function SearchFilterBar({ query, onQuery }: SearchFilterBarProps) {
  return (
    <div className="sticky top-18 z-30 border-y border-line bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1320px] px-5 py-4 sm:px-8">
        <div className="relative mx-auto w-full lg:max-w-xl">
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
      </div>
    </div>
  )
}
