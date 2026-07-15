import { Link } from 'react-router-dom'
import type { PortalConfig } from '../data/portals'

/** Split hero matching the EPX site design: deep-blue gradient copy panel on
 *  the left, full-bleed stage photo on the right. */
export function SplitHero({ portal }: { portal: PortalConfig }) {
  const isPast = portal.key === 'past'

  return (
    <section className="relative grid min-h-[86dvh] overflow-hidden lg:grid-cols-[53fr_47fr]">
      {/* Copy panel */}
      <div className="relative flex flex-col justify-center bg-[linear-gradient(135deg,#1d3f95_0%,#16307c_45%,#0b1f56_100%)] px-6 py-24 sm:px-12 lg:px-16 xl:px-24">
        <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
          <span className="text-[#f2c94c]">{isPast ? 'Meet Our' : 'Meet The'}</span>
          <br />
          <span className="text-white">{isPast ? 'Past Speakers' : '2026 Speakers'}</span>
        </h1>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.08em] text-white sm:text-base">
          {isPast ? 'Take a look at who has spoken' : 'See who is taking the stage'}
        </p>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
          2,000+ event professionals. Three transformative days. Discover the
          entrepreneurs, innovators, and industry leaders who have taken the
          stage at The Event Planner Expo, and meet many of the event
          professionals who return year after year. Join us this year in New
          York City October 27th–29th.
        </p>

        <p className="mt-12 text-sm font-bold uppercase tracking-[0.08em] text-white sm:text-base">
          Register now for tickets
        </p>
        <div className="mt-4">
          <a
            href="https://www.theeventplannerexpo.com/#tickets"
            className="inline-flex h-13 items-center justify-center rounded-md bg-[#e03131] px-8 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#c22525]"
          >
            Get Tickets
          </a>
        </div>

        <div className="mt-10">
          <Link
            to={isPast ? '/2026-speakers' : '/past-speakers'}
            className="text-sm font-semibold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            {isPast ? 'See the 2026 speakers →' : 'View past speakers →'}
          </Link>
        </div>
      </div>

      {/* Photo panel */}
      <div className="relative hidden min-h-[420px] bg-[#0b1f56] lg:block">
        <img
          src={isPast ? '/images/past-hero.jpg' : '/images/upcoming-hero.jpg'}
          alt="On stage at The Event Planner Expo"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
      </div>
    </section>
  )
}
