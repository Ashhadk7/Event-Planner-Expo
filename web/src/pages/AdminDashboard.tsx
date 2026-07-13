import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { TextInput } from '../components/ui/Field'
import { adminToken, adminLogout, invite, getPending, approve as apiApprove, reject as apiReject } from '../lib/api'
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
  Send,
} from 'lucide-react'
import { LinkedInIcon } from '../components/ui/BrandIcons'

type Tab = 'pending' | 'upcoming' | 'past'

interface PendingRow {
  id: string
  email: string
  approved: Record<string, unknown> | null
  pending: {
    firstName: string
    lastName: string
    title: string
    company: string
    bio?: string
    expertise?: string[]
    linkedin?: string
    type?: string
    year?: number
  }
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('pending')
  const [reviewingApp, setReviewingApp] = useState<PendingRow | null>(null)
  const [query, setQuery] = useState('')

  const [pendingApps, setPendingApps] = useState<any[]>([])
  const [inviteForm, setInviteForm] = useState({ firstName: '', lastName: '', email: '' })
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteOk, setInviteOk] = useState(true)

  useEffect(() => {
    if (!adminToken()) { navigate('/login'); return; }
    getPending().then((d) => setPendingApps(d.pending)).catch(() => setPendingApps([]))
  }, [navigate])

  useEffect(() => setQuery(''), [activeTab])

  const handleLogout = () => { adminLogout(); navigate('/login'); }

  const handleApprove = async (id: string) => { await apiApprove(id); const d = await getPending(); setPendingApps(d.pending); }
  const handleReject  = async (id: string) => { await apiReject(id);  const d = await getPending(); setPendingApps(d.pending); }
  const handleInvite  = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await invite(inviteForm.firstName, inviteForm.lastName, inviteForm.email);
      setInviteOk(r.emailSent);
      setInviteMsg(r.emailSent ? 'Invite sent.' : 'Speaker created, but the email failed to send.');
      setInviteForm({ firstName: '', lastName: '', email: '' });
    } catch (err: any) { setInviteOk(false); setInviteMsg(err.message || 'Invite failed.'); }
  };

  const q = query.trim().toLowerCase()
  const matchApp = (a: PendingRow) =>
    !q || `${a.pending.firstName} ${a.pending.lastName} ${a.pending.company} ${a.pending.title}`.toLowerCase().includes(q)

  const rows = activeTab === 'pending' ? pendingApps.filter(matchApp) : []

  // Live-speaker tabs are placeholders — data comes from /api/speakers (Task 7)
  const upcomingCount = 0
  const pastCount = 0

  const NAV: { key: Tab; label: string; icon: typeof Clock; badge?: number }[] = [
    { key: 'pending', label: 'Pending Apps', icon: Clock, badge: pendingApps.length },
    { key: 'upcoming', label: '2026 Speakers', icon: Users },
    { key: 'past', label: 'Past Speakers', icon: Calendar },
  ]

  const stats = [
    { label: 'Pending', value: pendingApps.length, icon: Clock, accent: 'text-red-500 bg-red-50' },
    { label: '2026 Speakers', value: upcomingCount, icon: Users, accent: 'text-ink-700 bg-ink-50' },
    { label: 'Past Speakers', value: pastCount, icon: Calendar, accent: 'text-ink-700 bg-ink-50' },
    { label: 'Total Roster', value: upcomingCount + pastCount, icon: CheckCircle2, accent: 'text-gold-600 bg-gold-400/10' },
  ]

  const headings: Record<Tab, { title: string; sub: string }> = {
    pending: { title: 'Pending Applications', sub: 'Review and approve incoming speaker requests.' },
    upcoming: { title: '2026 Roster', sub: 'Manage the active lineup for the upcoming expo.' },
    past: { title: 'Past Speakers', sub: 'Archive of speakers from previous editions.' },
  }

  return (
    <div className="min-h-screen bg-paper-2">
      {reviewingApp && (
        <ReviewModal
          app={reviewingApp}
          onClose={() => setReviewingApp(null)}
          onApprove={async () => {
            await handleApprove(reviewingApp.id)
            setReviewingApp(null)
          }}
          onReject={async () => {
            await handleReject(reviewingApp.id)
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

        {/* Invite form (pending tab only) */}
        {activeTab === 'pending' && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[0_2px_10px_-6px_rgba(7,10,51,0.15)]">
            <h2 className="mb-4 font-display text-base font-bold tracking-tight text-heading">Invite a Speaker</h2>
            <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted">First Name</label>
                <TextInput
                  value={inviteForm.firstName}
                  onChange={(e) => setInviteForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="Jane"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Last Name</label>
                <TextInput
                  value={inviteForm.lastName}
                  onChange={(e) => setInviteForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="Smith"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Email</label>
                <TextInput
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-ink-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
              >
                <Send className="h-4 w-4" />
                Send Invite
              </button>
            </form>
            {inviteMsg && (
              <p className={`mt-3 text-[13px] font-medium ${inviteOk ? 'text-green-700' : 'text-red-600'}`}>{inviteMsg}</p>
            )}
          </div>
        )}

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
                  rows.map((app: PendingRow) => (
                    <tr key={app.id} className="transition-colors hover:bg-paper-2/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ink-600 to-ink-900 text-[13px] font-bold text-white">
                            {app.pending.firstName?.[0]}
                            {app.pending.lastName?.[0]}
                          </span>
                          <div>
                            <div className="font-semibold text-heading">
                              {app.pending.firstName} {app.pending.lastName}
                            </div>
                            <div className="mt-0.5 text-[12px] text-muted">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-heading">{app.pending.title}</div>
                        <div className="text-muted">{app.pending.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-ink-50 px-3 py-1 text-[12px] font-semibold text-ink-700">
                          {app.pending.type || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-heading">{app.email}</div>
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
                            onClick={() => handleApprove(app.id)}
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

                {/* Published speakers live on the public site; the admin panel
                    manages invitations and the pending-approval queue. */}
                {activeTab !== 'pending' && (
                  <EmptyRow
                    colSpan={4}
                    title="Published speakers appear on the public site"
                    sub="Speakers edit their own profiles via their invite link; approve their changes in the Pending tab to publish."
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

function ReviewModal({
  app,
  onClose,
  onApprove,
  onReject,
}: {
  app: PendingRow
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
            {app.pending.firstName?.[0]}
            {app.pending.lastName?.[0]}
          </span>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center rounded-full bg-ink-50 px-2.5 py-1 text-[11px] font-semibold text-ink-700">
              {app.pending.type || 'Speaker'}
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-heading">
              {app.pending.firstName} {app.pending.lastName}
            </h2>
            <p className="mt-0.5 text-body">
              {app.pending.title} · {app.pending.company}
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
            {app.pending.linkedin && (
              <div className="sm:col-span-2">
                <InfoTile
                  icon={<LinkedInIcon className="h-4 w-4" />}
                  label="LinkedIn"
                  value={
                    <a href={app.pending.linkedin} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                      {app.pending.linkedin}
                    </a>
                  }
                />
              </div>
            )}
          </div>

          {app.pending.expertise && app.pending.expertise.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Expertise</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {app.pending.expertise.map((t, i) => (
                  <span key={i} className="rounded-full border border-line bg-paper-2 px-3 py-1.5 text-[12px] font-medium text-body">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {app.pending.bio && (
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Bio</p>
              <p className="mt-2 leading-relaxed text-body">{app.pending.bio}</p>
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
