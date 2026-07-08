import { useRef } from 'react'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import type { PortalConfig } from '../data/portals'

/**
 * The hero centerpiece — a floating all-access pass. Deep navy card with a
 * gold hairline, perforated stub and CSS barcode. Tilts gently towards the
 * cursor on desktop; floats on its own otherwise.
 */
export function EventTicket({ portal }: { portal: PortalConfig }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isPast = portal.key === 'past'

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateY(${px * 9}deg) rotateX(${py * -9}deg)`
  }
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <div className="relative mx-auto w-full max-w-[420px]" style={{ perspective: '1200px' }}>
      {/* soft glows behind the card */}
      <div className="absolute -left-10 top-6 h-52 w-52 rounded-full bg-ink-500/15 blur-3xl" />
      <div className="absolute -right-8 bottom-4 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />

      <div className="ticket-float">
        <div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="band-dark grain relative overflow-hidden rounded-[26px] text-white shadow-[0_40px_80px_-32px_rgba(1,2,25,0.5)] ring-1 ring-white/10 transition-transform duration-200 ease-out will-change-transform"
        >
          <span className="ticket-shine" />
          {/* oversized ghost numerals */}
          <span
            aria-hidden="true"
            className="font-display pointer-events-none absolute -right-4 -top-7 select-none text-[9rem] font-bold leading-none text-white/[0.05]"
          >
            {isPast ? '25' : '26'}
          </span>

          <div className="relative p-7 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-500 font-display text-sm font-bold">
                E
              </span>
              <span className="kicker text-gold-400">
                {isPast ? 'Alumni Pass' : 'Official Pass'}
              </span>
            </div>

            <h3 className="font-display mt-7 text-[26px] font-bold leading-tight tracking-tight">
              The Event Planner
              <br />
              Expo {isPast ? <span className="text-white/60">Archive</span> : '2026'}
            </h3>
            <p className="mt-2 text-sm text-white/55">
              {isPast
                ? 'A decade of speakers, ambassadors & influencers.'
                : 'All-access · Speakers, Founders & Decision Makers'}
            </p>

            <dl className="mt-7 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-gold-400" />
                <dt className="sr-only">Dates</dt>
                <dd className="font-medium text-white/85">
                  {isPast ? '2025 & earlier editions' : 'October 27–29, 2026'}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gold-400" />
                <dt className="sr-only">Location</dt>
                <dd className="font-medium text-white/85">New York City</dd>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-gold-400" />
                <dt className="sr-only">Attendance</dt>
                <dd className="font-medium text-white/85">2,500+ event professionals</dd>
              </div>
            </dl>
          </div>

          {/* perforation */}
          <div className="relative flex items-center px-7 sm:px-8" aria-hidden="true">
            <span className="absolute -left-3 h-6 w-6 rounded-full bg-[#f8f9fe]" />
            <span className="w-full border-t-2 border-dashed border-white/15" />
            <span className="absolute -right-3 h-6 w-6 rounded-full bg-[#f8f9fe]" />
          </div>

          {/* stub */}
          <div className="relative flex items-center justify-between gap-4 p-7 pt-6 sm:px-8">
            <div className="barcode h-9 w-40 text-white/70" aria-hidden="true" />
            <span className="font-display text-xs font-semibold tracking-[0.2em] text-white/50">
              {isPast ? 'EPX·NYC·ALUM' : 'EPX·NYC·26'}
            </span>
          </div>
        </div>
      </div>

      {/* floating detail chips */}
      <div className="animate-fade-up absolute -left-4 -top-5 hidden rotate-[-4deg] items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 shadow-[0_18px_40px_-18px_rgba(7,10,51,0.35)] sm:flex">
        <span className="text-gold-500">✦</span>
        <span className="text-[13px] font-semibold text-heading">
          {isPast ? '300+ alumni on stage' : '3 days · 1 iconic stage'}
        </span>
      </div>
      <div className="animate-fade-up absolute -bottom-5 -right-2 hidden rotate-[3deg] items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 shadow-[0_18px_40px_-18px_rgba(7,10,51,0.35)] sm:flex">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-[13px] font-semibold text-heading">
          {isPast ? 'See who returns in 2026' : 'Speaker lineup is live'}
        </span>
      </div>
    </div>
  )
}
