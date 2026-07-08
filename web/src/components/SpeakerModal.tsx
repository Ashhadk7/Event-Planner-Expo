import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Building2 } from 'lucide-react'
import type { Speaker } from '../data/speakers'
import { Avatar } from './ui/Avatar'
import { TypeBadge } from './ui/TypeBadge'
import { ShareMenu } from './ShareMenu'
import { LinkedInIcon } from './ui/BrandIcons'

interface SpeakerModalProps {
  speaker: Speaker | null
  onClose: () => void
}

export function SpeakerModal({ speaker, onClose }: SpeakerModalProps) {
  useEffect(() => {
    if (!speaker) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [speaker, onClose])

  if (!speaker) return null

  const linkedin = speaker.linkedin.startsWith('http')
    ? speaker.linkedin
    : `https://${speaker.linkedin}`

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-ink-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${speaker.firstName} ${speaker.lastName}`}
    >
      <div
        className="animate-fade-up premium-scroll relative max-h-[94vh] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-red-500" />

        <div className="flex items-start gap-5 p-6 pt-8">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-ink-800 shadow-md">
            <Avatar speaker={speaker} initialsClassName="text-4xl" duotone={false} />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <TypeBadge type={speaker.type} size="md" />
            <h2 className="mt-3 font-display text-2xl font-bold leading-none tracking-tight text-heading">
              {speaker.firstName} {speaker.lastName}
            </h2>
            <p className="mt-2 text-[15px] font-semibold text-body">{speaker.title}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <Building2 className="h-4 w-4" />
              {speaker.company}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors hover:bg-paper-2 hover:text-heading"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6">
          {speaker.bio && (
            <p className="border-t border-line pt-5 text-[15px] leading-relaxed text-body">
              {speaker.bio}
            </p>
          )}

          {speaker.expertise && speaker.expertise.length > 0 && (
            <div className="mt-6">
              <span className="kicker text-muted">Expertise</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {speaker.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-paper-2 px-3 py-1.5 text-xs font-medium text-body"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line px-6 py-5">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink-700 px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-ink-800"
          >
            <LinkedInIcon className="h-4 w-4" />
            Connect on LinkedIn
          </a>
          <ShareMenu speaker={speaker} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
