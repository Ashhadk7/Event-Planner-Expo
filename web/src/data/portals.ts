export interface PortalConfig {
  key: 'upcoming' | 'past'
  /** Route path */
  path: string
  eyebrow: string
  title: string
  highlight: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  /** Predicate deciding which speakers appear on this portal */
  filterYear: (year: number) => boolean
}

/** Notable names who have shared the EPX stage (real alumni) — used in the marquee. */
export const NOTABLE_NAMES = [
  'Gary Vaynerchuk',
  'Mel Robbins',
  'Daymond John',
  'Barbara Corcoran',
  'Martha Stewart',
  'Tim Grover',
  'Jesse Itzler',
  'Kevin Harrington',
  'Colin Cowie',
  'Sharon Lechter',
]

export const PORTALS: Record<PortalConfig['key'], PortalConfig> = {
  upcoming: {
    key: 'upcoming',
    path: '/2026-speakers',
    eyebrow: 'NYC · October 27–29, 2026',
    title: 'Meet the 2026 Speakers,',
    highlight: 'Founders & Decision Makers',
    subtitle:
      'Discover founders, innovators and industry leaders taking the stage at the world’s premier gathering for event professionals. Join us in New York City this October.',
    primaryCta: { label: 'Register for the Expo', href: '#register' },
    secondaryCta: { label: 'View Past Speakers', href: '/past-speakers' },
    filterYear: (year) => year >= 2026,
  },
  past: {
    key: 'past',
    path: '/past-speakers',
    eyebrow: 'The alumni of The Event Planner Expo',
    title: 'Our 2025 & Past',
    highlight: 'Speakers & Ambassadors',
    subtitle:
      'Meet the speakers, ambassadors and influencers who shaped the Expo. Explore the community that built our stage — then see who’s taking it in 2026.',
    primaryCta: { label: 'See the 2026 Speakers', href: '/2026-speakers' },
    secondaryCta: { label: 'Join the Community', href: '#register' },
    filterYear: (year) => year < 2026,
  },
}
