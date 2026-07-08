interface LogoProps {
  /** 'light' = white text (over dark bands) · 'dark' = navy text (over white) */
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * EPX wordmark placeholder — grotesk type with the signature red mark.
 * Swap for the official logo asset once provided by the client.
 */
export function Logo({ tone = 'dark', className = '' }: LogoProps) {
  const name = tone === 'light' ? 'text-white' : 'text-heading'
  const sub = tone === 'light' ? 'text-white/45' : 'text-muted'
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-500 font-display text-base font-bold text-white shadow-[0_6px_16px_-6px_rgba(201,16,31,0.6)]">
        E
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[15px] font-bold tracking-tight ${name}`}>
          THE EVENT PLANNER EXPO<span className="text-red-500">.</span>
        </span>
        <span className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] ${sub}`}>
          Speaker Portal
        </span>
      </span>
    </span>
  )
}
