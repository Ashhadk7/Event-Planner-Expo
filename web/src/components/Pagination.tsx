import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number // 1-based
  pageCount: number
  onChange: (page: number) => void
}

/** Build a compact page list with ellipses, e.g. 1 … 4 5 [6] 7 8 … 12 */
function pageItems(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const items: (number | 'gap')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)
  if (start > 2) items.push('gap')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < pageCount - 1) items.push('gap')
  items.push(pageCount)
  return items
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null

  const go = (p: number) => onChange(Math.min(Math.max(1, p), pageCount))
  const items = pageItems(page, pageCount)

  const arrow =
    'grid h-10 w-10 place-items-center rounded-full border border-line text-body transition-colors hover:border-ink-300 hover:text-heading disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-body'

  return (
    <nav
      aria-label="Speaker pages"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className={arrow}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {items.map((it, i) =>
        it === 'gap' ? (
          <span
            key={`gap-${i}`}
            className="grid h-10 w-10 place-items-center text-sm text-muted"
          >
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            aria-label={`Page ${it}`}
            aria-current={it === page ? 'page' : undefined}
            onClick={() => go(it)}
            className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-all duration-200 ${
              it === page
                ? 'bg-ink-700 text-white shadow-[0_10px_24px_-12px_rgba(0,4,72,0.55)]'
                : 'border border-line text-body hover:border-ink-300 hover:text-heading'
            }`}
          >
            {it}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => go(page + 1)}
        disabled={page === pageCount}
        className={arrow}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
