import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Logo } from './ui/Logo'
import { LinkedInIcon, InstagramIcon, XIcon } from './ui/BrandIcons'

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="hairline-gold" />
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo tone="dark" />
            <p className="mt-5 text-sm leading-relaxed text-body">
              The premier gathering for event professionals, founders and decision-makers —
              connecting 2,500+ leaders shaping the future of live experiences.
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm text-heading">
              <MapPin className="h-4 w-4 text-red-500" />
              New York City · October 27–29, 2026
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Portals"
              links={[
                { label: '2026 Speakers', to: '/2026-speakers' },
                { label: 'Past Speakers', to: '/past-speakers' },
                { label: 'Become a Speaker', to: '#register' },
              ]}
            />
            <FooterCol
              title="Expo"
              links={[
                { label: 'Register', to: '#register' },
                { label: 'Exhibit', to: '#exhibit' },
                { label: 'Schedule', to: '#schedule' },
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                { label: 'About', to: '#about' },
                { label: 'Contact', to: '#contact' },
                { label: 'Press', to: '#press' },
              ]}
            />
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-line pt-7 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} The Event Planner Expo. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: LinkedInIcon, label: 'LinkedIn' },
              { Icon: InstagramIcon, label: 'Instagram' },
              { Icon: XIcon, label: 'X' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-body transition-colors duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; to: string }[]
}) {
  return (
    <div>
      <h3 className="kicker text-muted">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm font-medium text-body transition-colors duration-200 hover:text-red-600"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
