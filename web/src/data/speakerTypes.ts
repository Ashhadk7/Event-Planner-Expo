export type SpeakerType =
  | 'Main Day'
  | 'Fireside Chat'
  | 'Founder'
  | 'Influencer'
  | 'Ambassador'
  | 'Sponsor'

export interface SpeakerTypeStyle {
  /** Accent colour used for the badge dot + text (tuned for the dark canvas) */
  color: string
  /** Short label for compact contexts */
  short: string
}

/**
 * Badge accents adapted for the dark editorial theme. Colours are drawn from
 * the real EPX brand kit (red #FF0000, gold #F8C646, sky #93C5FD, grey #A6A6A6)
 * plus two complementary hues, each chosen for legibility on deep indigo.
 */
export const SPEAKER_TYPE_STYLES: Record<SpeakerType, SpeakerTypeStyle> = {
  'Main Day': { color: '#FF3B3B', short: 'Main' },
  'Fireside Chat': { color: '#2DD4BF', short: 'Fireside' },
  Founder: { color: '#F8C646', short: 'Founder' },
  Influencer: { color: '#A78BFA', short: 'Creator' },
  Ambassador: { color: '#93C5FD', short: 'Ambassador' },
  Sponsor: { color: '#C7C9D9', short: 'Sponsor' },
}

export const SPEAKER_TYPES = Object.keys(SPEAKER_TYPE_STYLES) as SpeakerType[]
