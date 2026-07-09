import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { PortalConfig } from '../data/portals'
import { NOTABLE_NAMES } from '../data/portals'
import { SPEAKERS, type Speaker } from '../data/speakers'
import { getPublicSpeakers } from '../lib/api'
import { SPEAKER_TYPES, type SpeakerType } from '../data/speakerTypes'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Marquee } from '../components/Marquee'
import { SectionHeader } from '../components/SectionHeader'
import { SearchFilterBar } from '../components/SearchFilterBar'
import { SpeakerGrid } from '../components/SpeakerGrid'
import { SpeakerModal } from '../components/SpeakerModal'
import { RegisterCta } from '../components/RegisterCta'
import { YearTabs } from '../components/YearTabs'

interface SpeakerHubProps {
  portal: PortalConfig
}

type Filter = SpeakerType | 'All'

export function SpeakerHub({ portal }: SpeakerHubProps) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<Filter>('All')
  const [active, setActive] = useState<Speaker | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [remote, setRemote] = useState<Speaker[] | null>(null)

  useEffect(() => {
    getPublicSpeakers().then((d) => setRemote(d.speakers as Speaker[])).catch(() => setRemote(null))
  }, [])

  const source = remote ?? SPEAKERS

  const portalSpeakers = useMemo(
    () => source.filter((s) => portal.filterYear(s.year)),
    [portal, source],
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: portalSpeakers.length }
    SPEAKER_TYPES.forEach((t) => {
      c[t] = portalSpeakers.filter((s) => s.type === t).length
    })
    return c
  }, [portalSpeakers])

  useEffect(() => {
    const slug = searchParams.get('speaker')
    const match = slug ? portalSpeakers.find((s) => s.slug === slug) : null
    setActive(match ?? null)
  }, [searchParams, portalSpeakers])

  useEffect(() => {
    setQuery('')
    setType('All')
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
    return portalSpeakers.filter((s) => {
      const matchesType = type === 'All' || s.type === type
      const matchesQuery =
        !q ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q)
      return matchesType && matchesQuery
    })
  }, [portalSpeakers, query, type])

  const resetFilters = () => {
    setQuery('')
    setType('All')
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero portal={portal} />

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
            <SearchFilterBar
              query={query}
              onQuery={setQuery}
              type={type}
              onType={setType}
              counts={counts}
            />
          </div>

          <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8">
            <SpeakerGrid speakers={filtered} onOpen={openSpeaker} onReset={resetFilters} />
          </div>
        </section>

        <RegisterCta portal={portal} />
      </main>
      <Footer />

      <SpeakerModal speaker={active} onClose={closeSpeaker} />
    </div>
  )
}
