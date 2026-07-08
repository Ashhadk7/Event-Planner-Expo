import { useEffect, useRef, useState } from 'react'
import { Share2, Link2, Mail, Check } from 'lucide-react'
import type { Speaker } from '../data/speakers'
import { LinkedInIcon, XIcon } from './ui/BrandIcons'

interface ShareMenuProps {
  speaker: Speaker
}

function speakerUrl(slug: string) {
  const base =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : ''
  return `${base}?speaker=${slug}`
}

export function ShareMenu({ speaker }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const url = speakerUrl(speaker.slug)
  const name = `${speaker.firstName} ${speaker.lastName}`
  const text = `${name}, ${speaker.title} at ${speaker.company} — speaking at The Event Planner Expo.`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  const items = [
    {
      label: copied ? 'Link copied!' : 'Copy link',
      icon: copied ? Check : Link2,
      onClick: copy,
      href: undefined as string | undefined,
    },
    {
      label: 'Share on LinkedIn',
      icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Share on X',
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Email to a friend',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(`${name} at The Event Planner Expo`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-heading transition-colors duration-200 hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-700"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full right-0 z-10 mb-2 w-56 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-xl"
        >
          {items.map(({ label, icon: Icon, href, onClick }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-paper-2 hover:text-heading"
              >
                <Icon className="h-4 w-4 text-muted" />
                {label}
              </a>
            ) : (
              <button
                key={label}
                type="button"
                onClick={onClick}
                role="menuitem"
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-body transition-colors hover:bg-paper-2 hover:text-heading"
              >
                <Icon
                  className={`h-4 w-4 ${copied ? 'text-emerald-600' : 'text-muted'}`}
                />
                {label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
