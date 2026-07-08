import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from './ui/Logo'

const NAV_LINKS = [
  { label: '2026 Speakers', to: '/2026-speakers' },
  { label: 'Past Speakers', to: '/past-speakers' },
  { label: 'Apply to Speak', to: '/signup' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line bg-white/85 shadow-[0_10px_34px_-20px_rgba(7,10,51,0.4)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <Link to="/2026-speakers" aria-label="The Event Planner Expo — home">
          <Logo tone={scrolled ? 'dark' : 'light'} />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`relative text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                  active 
                    ? (scrolled ? 'text-heading' : 'text-white')
                    : (scrolled ? 'text-body hover:text-heading' : 'text-white/60 hover:text-white')
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-red-500" />
                )}
              </Link>
            )
          })}
        </div>

        <Link
          to="/"
          className="group inline-flex h-10.5 items-center gap-1.5 rounded-full bg-red-500 px-5.5 text-[13px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_26px_-12px_rgba(201,16,31,0.55)] transition-all duration-300 hover:bg-red-600"
        >
          Register
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </nav>
    </header>
  )
}
