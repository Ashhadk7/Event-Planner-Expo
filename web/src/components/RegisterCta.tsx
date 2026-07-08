import { ArrowRight } from 'lucide-react'
import type { PortalConfig } from '../data/portals'
import { Reveal } from './Reveal'
import { Skyline } from './Skyline'

interface RegisterCtaProps {
  portal: PortalConfig
}

/** The single dark statement band — navy night sky over the NYC skyline. */
export function RegisterCta({ portal }: RegisterCtaProps) {
  const isPast = portal.key === 'past'
  return (
    <section id="register" className="band-dark grain relative overflow-hidden text-white">
      <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] w-full opacity-80" />

      <Reveal className="relative z-10 mx-auto max-w-3xl px-5 py-28 text-center sm:px-8 sm:py-36">
        <div className="mb-7 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold-400/70" />
          <span className="kicker text-gold-400">October 27–29, 2026 · New York City</span>
          <span className="h-px w-8 bg-gold-400/70" />
        </div>

        <h2 className="display-section text-balance text-white">
          {isPast ? (
            <>
              The 2026 stage is <span className="serif-accent text-gold-400">being set.</span>
            </>
          ) : (
            <>
              Your pass to the room{' '}
              <span className="serif-accent text-gold-400">where it happens.</span>
            </>
          )}
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          Join 2,500+ event professionals, founders and industry leaders for three days of
          connection, ideas and momentum.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://www.theeventplannerexpo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-red-500 px-8 text-[15px] font-semibold text-white shadow-[0_16px_44px_-14px_rgba(232,25,44,0.7)] transition-all duration-300 hover:bg-red-600"
          >
            Register for the Expo
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#speakers"
            className="inline-flex h-13 items-center justify-center rounded-full border border-white/25 px-8 text-[15px] font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white/5"
          >
            Become a Speaker
          </a>
        </div>
      </Reveal>
    </section>
  )
}
