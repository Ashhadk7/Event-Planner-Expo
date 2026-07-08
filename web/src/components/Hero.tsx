import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { PortalConfig } from '../data/portals'
import { Countdown } from './Countdown'
import { EventTicket } from './EventTicket'

function Cta({
  href,
  variant,
  children,
}: {
  href: string
  variant: 'primary' | 'ghost'
  children: React.ReactNode
}) {
  const cls =
    variant === 'primary'
      ? 'bg-red-500 text-white shadow-[0_14px_34px_-12px_rgba(201,16,31,0.5)] hover:bg-red-600 hover:shadow-[0_18px_40px_-12px_rgba(201,16,31,0.55)]'
      : 'border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/20'
  const base =
    'group inline-flex h-13 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold cursor-pointer transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-700'
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </>
  )
  return href.startsWith('#') ? (
    <a href={href} className={`${base} ${cls}`}>
      {inner}
    </a>
  ) : (
    <Link to={href} className={`${base} ${cls}`}>
      {inner}
    </Link>
  )
}

interface HeroProps {
  portal: PortalConfig
}

export function Hero({ portal }: HeroProps) {
  const isUpcoming = portal.key === 'upcoming'

  return (
    <section className="band-dark grain relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-12 pt-28">
      
      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] flex-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Copy column */}
        <div className="max-w-2xl text-center lg:text-left">
          <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-sm backdrop-blur-md">
            <span className="pulse-dot h-2 w-2 rounded-full bg-red-500" />
            <span className="kicker text-white">{portal.eyebrow}</span>
          </div>

          <h1
            className="animate-fade-up display-hero mt-7 text-balance text-white"
            style={{ animationDelay: '80ms' }}
          >
            {portal.title}{' '}
            <span className="serif-accent text-red-500">{portal.highlight}</span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg lg:mx-0"
            style={{ animationDelay: '160ms' }}
          >
            {portal.subtitle}
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            style={{ animationDelay: '240ms' }}
          >
            <Cta href={portal.primaryCta.href} variant="primary">
              {portal.primaryCta.label}
            </Cta>
            <Cta href={portal.secondaryCta.href} variant="ghost">
              {portal.secondaryCta.label}
            </Cta>
          </div>

          {isUpcoming ? (
            <div
              className="animate-fade-up mt-12 flex flex-col items-center gap-3 lg:items-start"
              style={{ animationDelay: '320ms' }}
            >
              <span className="kicker text-white/50">Doors open in</span>
              <Countdown />
            </div>
          ) : (
            <div
              className="animate-fade-up mt-12 flex items-center justify-center gap-8 lg:justify-start"
              style={{ animationDelay: '320ms' }}
            >
              {[
                ['10+', 'Editions'],
                ['300+', 'Alumni'],
                ['2,500+', 'Professionals'],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col items-center lg:items-start">
                  <span className="font-display text-3xl font-bold tabular-nums text-white">
                    {value}
                  </span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/50">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket column */}
        <div
          className="animate-fade-up relative px-2 py-6 sm:px-0"
          style={{ animationDelay: '200ms' }}
        >
          <EventTicket portal={portal} />
        </div>
      </div>

      <div className="hairline-gold relative z-10 w-full" />
    </section>
  )
}
