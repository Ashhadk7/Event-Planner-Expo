import { useState } from 'react'
import { Logo } from '../components/ui/Logo'
import { speakers, type Speaker } from '../data/speakers'
import { EditSpeakerModal } from '../components/admin/EditSpeakerModal'

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null)

  // Simple mock login
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-1 p-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-2xl">
          <div className="mb-8 flex justify-center">
            <Logo tone="dark" />
          </div>
          <h1 className="mb-6 text-center font-display text-2xl font-bold tracking-tight text-heading">
            Admin Login
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setIsAuthenticated(true)
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-heading">Password</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-line bg-paper-1 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Enter admin password"
                defaultValue="password123"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-red-500 px-4 py-3 font-bold text-white transition-colors hover:bg-red-600"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Filter speakers based on the tab
  const displayedSpeakers = speakers.filter(s => 
    activeTab === 'upcoming' ? s.year >= 2026 : s.year < 2026
  )

  return (
    <div className="min-h-screen bg-paper-1">
      {editingSpeaker && (
        <EditSpeakerModal
          speaker={editingSpeaker}
          onClose={() => setEditingSpeaker(null)}
        />
      )}
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-line bg-white px-6">
        <div className="flex items-center gap-6">
          <Logo tone="dark" />
          <span className="rounded-md bg-ink-900 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-body hover:text-heading">Settings</button>
          <button className="text-sm font-semibold text-body hover:text-heading">Log Out</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-6 pt-10">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-heading">
              Speaker Management
            </h1>
            <p className="mt-2 text-body">
              Manage your event speakers, approve signups, and edit profiles.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-heading shadow-sm hover:bg-paper-2">
              Export CSV
            </button>
            <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-600">
              Refresh from Sheets
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-6 border-b border-line">
          <button
            className={`border-b-2 pb-3 text-sm font-bold transition-colors ${
              activeTab === 'upcoming'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-muted hover:text-body'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            2026 Speakers
          </button>
          <button
            className={`border-b-2 pb-3 text-sm font-bold transition-colors ${
              activeTab === 'past'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-muted hover:text-body'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Speakers
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50 text-xs font-bold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-6 py-4">Speaker</th>
                <th className="px-6 py-4">Title & Company</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {displayedSpeakers.map((speaker) => (
                <tr key={speaker.id} className="transition-colors hover:bg-paper-2">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-ink-200">
                        {speaker.photoUrl ? (
                          <img src={speaker.photoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-ink-900 font-bold text-white">
                            {speaker.firstName[0]}
                            {speaker.lastName[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-heading">
                          {speaker.firstName} {speaker.lastName}
                        </div>
                        {speaker.country && (
                          <div className="text-xs text-muted">{speaker.country}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-heading">{speaker.title}</div>
                    <div className="text-muted">{speaker.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-900">
                      {speaker.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                      Live
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingSpeaker(speaker)}
                      className="text-sm font-bold text-red-500 hover:text-red-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {displayedSpeakers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">
                    No speakers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
