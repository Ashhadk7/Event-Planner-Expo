import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { PortalConfig } from '../data/portals'
import { NOTABLE_NAMES } from '../data/portals'
import { SPEAKERS, type Speaker } from '../data/speakers'
import { getPublicSpeakers } from '../lib/api'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { SplitHero } from '../components/SplitHero'
import { Marquee } from '../components/Marquee'
import { SectionHeader } from '../components/SectionHeader'
import { SearchFilterBar } from '../components/SearchFilterBar'
import { SpeakerGrid } from '../components/SpeakerGrid'
import { SpeakerModal } from '../components/SpeakerModal'
import { RegisterCta } from '../components/RegisterCta'
import { YearTabs } from '../components/YearTabs'
import { Pagination } from '../components/Pagination'

const PAGE_SIZE = 10

interface SpeakerHubProps {
  portal: PortalConfig
}

export function SpeakerHub({ portal }: SpeakerHubProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<Speaker | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [remote, setRemote] = useState<Speaker[] | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    getPublicSpeakers().then((d) => setRemote(d.speakers as Speaker[])).catch(() => setRemote(null))
  }, [])

  const source = remote ?? SPEAKERS

  const portalSpeakers = useMemo(
    () => source.filter((s) => portal.filterYear(s.year)),
    [portal, source],
  )

  useEffect(() => {
    const slug = searchParams.get('speaker')
    const match = slug ? portalSpeakers.find((s) => s.slug === slug) : null
    setActive(match ?? null)
  }, [searchParams, portalSpeakers])

  useEffect(() => {
    setQuery('')
  }, [portal.key])

  const openSpeaker = (s: Speaker) => {
    const next = new URLSearchParams(searchParams)
    next.set('speaker', s.slug)
    setSearchParams(next)
  }

  const closeSpeaker = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('speaker')
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return portalSpeakers
    return portalSpeakers.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q),
    )
  }, [portalSpeakers, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  // Reset to the first page whenever the result set changes (search, year tab)
  // so we never land on a page that no longer exists.
  useEffect(() => {
    setPage(1)
  }, [query, portal.key])

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  const changePage = (p: number) => {
    setPage(p)
    document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth' })
  }

  const resetFilters = () => {
    setQuery('')
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {portal.key === 'past' ? <SplitHero portal={portal} /> : <Hero portal={portal} />}

        {/* Notable-names marquee — social proof */}
        <div className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-[1320px] flex-col px-5 pt-4 sm:px-8">
            <span className="kicker text-muted">
              {portal.key === 'past' ? 'Alumni of our stage' : 'As seen on the EPX stage'}
            </span>
            <Marquee items={NOTABLE_NAMES} />
          </div>
        </div>

        <section id="speakers" className="scroll-mt-32">
          <div className="pt-12 sm:pt-16">
            <YearTabs active={portal.key} />
          </div>
          <div className="mx-auto max-w-[1320px] px-5 pt-8 sm:px-8">
            <SectionHeader
              kicker="The Lineup"
              title={
                <>
                  {filtered.length} {portal.key === 'past' ? 'Alumni' : 'Speakers'}{' '}
                  <span className="serif-accent text-ink-300">taking the stage</span>
                </>
              }
            />
          </div>

          <div className="mt-8">
            <SearchFilterBar query={query} onQuery={setQuery} />
          </div>

          <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8">
            <SpeakerGrid speakers={paged} onOpen={openSpeaker} onReset={resetFilters} />
            <Pagination page={page} pageCount={pageCount} onChange={changePage} />
          </div>
        </section>

        <RegisterCta portal={portal} />
      </main>
      <Footer />

      <SpeakerModal speaker={active} onClose={closeSpeaker} />
    </div>
  )
}
