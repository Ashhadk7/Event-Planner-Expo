import { Link } from 'react-router-dom'
import { PORTALS, type PortalConfig } from '../data/portals'

/**
 * Primary year switcher for the speaker pages — a segmented control that lets
 * visitors flip between the 2026 lineup and the 2025 & past alumni. Rendered as
 * links because each year is its own route.
 */
export function YearTabs({ active }: { active: PortalConfig['key'] }) {
  const tabs: { key: PortalConfig['key']; label: string; sub: string }[] = [
    { key: 'upcoming', label: '2026 Speakers', sub: 'This year' },
    { key: 'past', label: '2025 & Past', sub: 'Alumni' },
  ]

  return (
    <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
      <div
        role="tablist"
        aria-label="Choose a speaker year"
        className="inline-flex items-center gap-1 rounded-full border border-line bg-paper-2 p-1"
      >
        {tabs.map((t) => {
          const isActive = t.key === active
          return (
            <Link
              key={t.key}
              to={PORTALS[t.key].path}
              role="tab"
              aria-selected={isActive}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-ink-700 text-white shadow-[0_10px_24px_-12px_rgba(0,4,72,0.55)]'
                  : 'text-body hover:text-heading'
              }`}
            >
              {t.label}
              <span
                className={`hidden text-[11px] font-medium sm:inline ${
                  isActive ? 'text-white/60' : 'text-muted'
                }`}
              >
                {t.sub}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
