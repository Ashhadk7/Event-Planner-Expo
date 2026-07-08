import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { TextInput } from '../components/ui/Field'
import { TypeBadge } from '../components/ui/TypeBadge'
import { SPEAKERS, type Speaker } from '../data/speakers'
import type { SpeakerType } from '../data/speakerTypes'
import { EditSpeakerModal } from '../components/admin/EditSpeakerModal'
import {
  Search,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  LogOut,
  ChevronRight,
  Check,
  X,
  Mail,
  Phone,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { LinkedInIcon } from '../components/ui/BrandIcons'

type Tab = 'pending' | 'upcoming' | 'past'

interface PendingApp {
  id: string
  firstName: string
  lastName: string
  title: string
  company: string
  email: string
  phone: string
  linkedIn: string
  speakerType: string
  tags: string
  bio: string
  dateAdded: string
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('pending')
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null)
  const [reviewingApp, setReviewingApp] = useState<PendingApp | null>(null)
  const [deletingSpeaker, setDeletingSpeaker] = useState<Speaker | null>(null)
  const [query, setQuery] = useState('')

  const [liveSpeakers, setLiveSpeakers] = useState<Speaker[]>([])
  const [pendingApps, setPendingApps] = useState<PendingApp[]>([])

  useEffect(() => {
    if (localStorage.getItem('epx_admin_auth') !== 'true') {
      navigate('/login')
      return
    }
    const storedLive = localStorage.getItem('epx_live_speakers')
    if (storedLive) {
      setLiveSpeakers(JSON.parse(storedLive))
    } else {
      setLiveSpeakers(SPEAKERS)
      localStorage.setItem('epx_live_speakers', JSON.stringify(SPEAKERS))
    }
    const storedPending = localStorage.getItem('epx_pending_speakers')
    if (storedPending) setPendingApps(JSON.parse(storedPending))
  }, [navigate])

  useEffect(() => setQuery(''), [activeTab])

  const handleLogout = () => {
    localStorage.removeItem('epx_admin_auth')
    navigate('/login')
  }

  const handleApprove = (app: PendingApp) => {
    const newSpeaker: Speaker = {
      id: app.id,
      slug: `${app.firstName}-${app.lastName}`.toLowerCase().replace(/\s+/g, '-'),
      firstName: app.firstName,
      lastName: app.lastName,
      title: app.title,
      company: app.company,
      bio: app.bio,
      type: (app.speakerType || 'Main Day') as SpeakerType,
      year: 2026,
      linkedin: app.linkedIn,
      expertise: app.tags ? app.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
    }
    const updatedLive = [newSpeaker, ...liveSpeakers]
    setLiveSpeakers(updatedLive)
    localStorage.setItem('epx_live_speakers', JSON.stringify(updatedLive))
    const updatedPending = pendingApps.filter((p) => p.id !== app.id)
    setPendingApps(updatedPending)
    localStorage.setItem('epx_pending_speakers', JSON.stringify(updatedPending))
  }

  const handleReject = (id: string) => {
    const updatedPending = pendingApps.filter((p) => p.id !== id)
    setPendingApps(updatedPending)
    localStorage.setItem('epx_pending_speakers', JSON.stringify(updatedPending))
  }

  const handleDelete = (id: string) => {
    const updatedLive = liveSpeakers.filter((s) => s.id !== id)
    setLiveSpeakers(updatedLive)
    localStorage.setItem('epx_live_speakers', JSON.stringify(updatedLive))
  }

  const upcomingSpeakers = useMemo(() => liveSpeakers.filter((s) => s.year >= 2026), [liveSpeakers])
  const pastSpeakers = useMemo(() => liveSpeakers.filter((s) => s.year < 2026), [liveSpeakers])

  const q = query.trim().toLowerCase()
  const matchSpeaker = (s: Speaker) =>
    !q || `${s.firstName} ${s.lastName} ${s.company} ${s.title}`.toLowerCase().includes(q)
  const matchApp = (a: PendingApp) =>
    !q || `${a.firstName} ${a.lastName} ${a.company} ${a.title}`.toLowerCase().includes(q)

  const rows = activeTab === 'pending' ? pendingApps.filter(matchApp) : []
  const speakerRows =
    activeTab === 'upcoming'
      ? upcomingSpeakers.filter(matchSpeaker)
      : activeTab === 'past'
        ? pastSpeakers.filter(matchSpeaker)
        : []

  const NAV: { key: Tab; label: string; icon: typeof Clock; badge?: number }[] = [
    { key: 'pending', label: 'Pending Apps', icon: Clock, badge: pendingApps.length },
    { key: 'upcoming', label: '2026 Speakers', icon: Users },
    { key: 'past', label: 'Past Speakers', icon: Calendar },
  ]

  const stats = [
    { label: 'Pending', value: pendingApps.length, icon: Clock, accent: 'text-red-500 bg-red-50' },
    { label: '2026 Speakers', value: upcomingSpeakers.length, icon: Users, accent: 'text-ink-700 bg-ink-50' },
    { label: 'Past Speakers', value: pastSpeakers.length, icon: Calendar, accent: 'text-ink-700 bg-ink-50' },
    { label: 'Total Roster', value: liveSpeakers.length, icon: CheckCircle2, accent: 'text-gold-600 bg-gold-400/10' },
  ]

  const headings: Record<Tab, { title: string; sub: string }> = {
    pending: { title: 'Pending Applications', sub: 'Review and approve incoming speaker requests.' },
    upcoming: { title: '2026 Roster', sub: 'Manage the active lineup for the upcoming expo.' },
    past: { title: 'Past Speakers', sub: 'Archive of speakers from previous editions.' },
  }

  return (
    <div className="min-h-screen bg-paper-2">
      {editingSpeaker && (
        <EditSpeakerModal
          speaker={editingSpeaker}
          onClose={() => setEditingSpeaker(null)}
          onDelete={() => {
            setDeletingSpeaker(editingSpeaker)
            setEditingSpeaker(null)
          }}
        />
      )}

      {deletingSpeaker && (
        <ConfirmDeleteDialog
          speaker={deletingSpeaker}
          onCancel={() => setDeletingSpeaker(null)}
          onConfirm={() => {
            handleDelete(deletingSpeaker.id)
            setDeletingSpeaker(null)
          }}
        />
      )}

      {reviewingApp && (
        <ReviewModal
          app={reviewingApp}
          onClose={() => setReviewingApp(null)}
          onApprove={() => {
            handleApprove(reviewingApp)
            setReviewingApp(null)
          }}
          onReject={() => {
            handleReject(reviewingApp.id)
            setReviewingApp(null)
          }}
        />
      )}

      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-20 items-center border-b border-line px-7">
          <Logo tone="dark" />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Management
          </p>
          <nav className="space-y-1.5">
            {NAV.map(({ key, label, icon: Icon, badge }) => {
              const active = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors duration-200 ${
                    active ? 'bg-ink-700 text-white shadow-[0_12px_28px_-14px_rgba(0,4,72,0.7)]' : 'text-body hover:bg-paper-2 hover:text-heading'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-[18px] w-[18px]" />
                    {label}
                  </span>
                  {badge ? (
                    <span
                      className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${
                        active ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {badge}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </nav>
        </div>
        <div className="border-t border-line p-4">
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-body transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 border-b border-line bg-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          <Logo tone="dark" />
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-body transition-colors hover:bg-paper-2"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none]">
          {NAV.map(({ key, label, icon: Icon, badge }) => {
            const active = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  active ? 'bg-ink-700 text-white' : 'border border-line bg-white text-body'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {badge ? (
                  <span className={`text-[11px] font-bold ${active ? 'text-white/70' : 'text-red-600'}`}>{badge}</span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main */}
      <main className="px-5 py-8 sm:px-8 lg:ml-72 lg:px-10 lg:py-10">
        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_10px_-6px_rgba(7,10,51,0.15)]">
              <div className="flex items-center justify-between">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 font-display text-3xl font-bold tabular-nums tracking-tight text-heading">{value}</p>
              <p className="mt-1 text-[13px] font-medium text-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Header + search */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-heading sm:text-3xl">
              {headings[activeTab].title}
            </h1>
            <p className="mt-1.5 text-body">{headings[activeTab].sub}</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or company…"
              aria-label="Search records"
              className="pl-11"
            />
          </div>
        </header>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_16px_-8px_rgba(7,10,51,0.15)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-paper-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                <tr>
                  <th className="px-6 py-4">Profile</th>
                  <th className="px-6 py-4">Role &amp; Company</th>
                  <th className="px-6 py-4">Type</th>
                  {activeTab === 'pending' && <th className="px-6 py-4">Contact</th>}
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {/* Pending */}
                {activeTab === 'pending' &&
                  rows.map((app) => (
                    <tr key={app.id} className="transition-colors hover:bg-paper-2/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ink-600 to-ink-900 text-[13px] font-bold text-white">
                            {app.firstName[0]}
                            {app.lastName[0]}
                          </span>
                          <div>
                            <div className="font-semibold text-heading">
                              {app.firstName} {app.lastName}
                            </div>
                            <div className="mt-0.5 text-[12px] text-muted">
                              Applied {new Date(app.dateAdded).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-heading">{app.title}</div>
                        <div className="text-muted">{app.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-ink-50 px-3 py-1 text-[12px] font-semibold text-ink-700">
                          {app.speakerType || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-heading">{app.email}</div>
                        <div className="text-muted">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleReject(app.id)}
                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line text-body transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                            aria-label="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(app)}
                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line text-body transition-colors hover:border-green-600 hover:bg-green-50 hover:text-green-700"
                            aria-label="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setReviewingApp(app)}
                            className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg bg-ink-700 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-ink-800"
                          >
                            Review
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {activeTab === 'pending' && rows.length === 0 && (
                  <EmptyRow
                    colSpan={5}
                    title={q ? 'No matching applications' : 'All caught up'}
                    sub={q ? 'Try a different search.' : 'There are no pending applications to review.'}
                  />
                )}

                {/* Live speakers */}
                {activeTab !== 'pending' &&
                  speakerRows.map((s) => (
                    <tr key={s.id} className="transition-colors hover:bg-paper-2/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-ink-200">
                            {s.photoUrl ? (
                              <img src={s.photoUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="grid h-full w-full place-items-center bg-gradient-to-br from-ink-600 to-ink-900 text-[13px] font-bold text-white">
                                {s.firstName[0]}
                                {s.lastName[0]}
                              </span>
                            )}
                          </span>
                          <div>
                            <div className="font-semibold text-heading">
                              {s.firstName} {s.lastName}
                            </div>
                            {s.country && <div className="mt-0.5 text-[12px] text-muted">{s.country}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-heading">{s.title}</div>
                        <div className="text-muted">{s.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <TypeBadge type={s.type} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingSpeaker(s)}
                            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line px-3.5 text-[13px] font-semibold text-heading transition-colors hover:border-ink-300 hover:bg-paper-2"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Manage
                          </button>
                          <button
                            onClick={() => setDeletingSpeaker(s)}
                            aria-label={`Remove ${s.firstName} ${s.lastName}`}
                            title="Remove from lineup"
                            className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-line text-body transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {activeTab !== 'pending' && speakerRows.length === 0 && (
                  <EmptyRow
                    colSpan={4}
                    title="No speakers found"
                    sub={q ? 'Try a different search.' : 'This roster is empty.'}
                  />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

function EmptyRow({ colSpan, title, sub }: { colSpan: number; title: string; sub: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-11 w-11 text-ink-200" />
        <h3 className="font-display text-lg font-bold text-heading">{title}</h3>
        <p className="mt-1 text-muted">{sub}</p>
      </td>
    </tr>
  )
}

function ConfirmDeleteDialog({
  speaker,
  onCancel,
  onConfirm,
}: {
  speaker: Speaker
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-t-3xl bg-white p-7 text-center shadow-2xl sm:rounded-3xl"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-500/15">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold tracking-tight text-heading">
          Remove this speaker?
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-body">
          <span className="font-semibold text-heading">
            {speaker.firstName} {speaker.lastName}
          </span>{' '}
          will be removed from the {speaker.year >= 2026 ? '2026' : 'past'} lineup. This can't be undone.
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold text-heading transition-colors hover:bg-paper-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(232,25,44,0.6)] transition-colors hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Remove speaker
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewModal({
  app,
  onClose,
  onApprove,
  onReject,
}: {
  app: PendingApp
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up relative w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <span className="absolute inset-x-0 top-0 h-1 bg-red-500" />
        <div className="flex items-start gap-4 border-b border-line px-6 py-6 sm:px-8">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-ink-600 to-ink-900 text-lg font-bold text-white">
            {app.firstName[0]}
            {app.lastName[0]}
          </span>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full bg-ink-50 px-2.5 py-1 text-[11px] font-semibold text-ink-700">
              {app.speakerType || 'Speaker'}
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-heading">
              {app.firstName} {app.lastName}
            </h2>
            <p className="mt-0.5 text-body">
              {app.title} · {app.company}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors hover:bg-paper-2 hover:text-heading"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoTile icon={<Mail className="h-4 w-4" />} label="Email" value={app.email} />
            <InfoTile icon={<Phone className="h-4 w-4" />} label="Phone" value={app.phone} />
            <div className="sm:col-span-2">
              <InfoTile
                icon={<LinkedInIcon className="h-4 w-4" />}
                label="LinkedIn"
                value={
                  <a href={app.linkedIn} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                    {app.linkedIn}
                  </a>
                }
              />
            </div>
          </div>

          {app.tags && (
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Expertise</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {app.tags.split(',').map((t, i) => (
                  <span key={i} className="rounded-full border border-line bg-paper-2 px-3 py-1.5 text-[12px] font-medium text-body">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {app.bio && (
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Bio</p>
              <p className="mt-2 leading-relaxed text-body">{app.bio}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line bg-paper-2 px-6 py-4 sm:px-8">
          <button
            onClick={onReject}
            className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(22,163,74,0.6)] transition-colors hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            Approve Speaker
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-line bg-paper-2/50 px-4 py-3">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        <span className="text-ink-400">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 break-words font-medium text-heading">{value}</p>
    </div>
  )
}
