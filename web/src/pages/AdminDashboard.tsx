import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { SPEAKERS, type Speaker } from '../data/speakers'
import { EditSpeakerModal } from '../components/admin/EditSpeakerModal'
import { Search, Filter, CheckCircle2, Clock, Users, Calendar, LogOut, ChevronRight, Check, X } from 'lucide-react'

type Tab = 'pending' | 'upcoming' | 'past'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('pending')
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null)
  const [reviewingApp, setReviewingApp] = useState<any | null>(null)
  
  // Simulated Database State
  const [liveSpeakers, setLiveSpeakers] = useState<Speaker[]>([])
  const [pendingApps, setPendingApps] = useState<any[]>([])

  useEffect(() => {
    const isAuth = localStorage.getItem('epx_admin_auth')
    if (isAuth !== 'true') {
      navigate('/login')
      return
    }

    // Load Live Speakers
    const storedLive = localStorage.getItem('epx_live_speakers')
    if (storedLive) {
      setLiveSpeakers(JSON.parse(storedLive))
    } else {
      setLiveSpeakers(SPEAKERS)
      localStorage.setItem('epx_live_speakers', JSON.stringify(SPEAKERS))
    }

    // Load Pending Applications
    const storedPending = localStorage.getItem('epx_pending_speakers')
    if (storedPending) {
      setPendingApps(JSON.parse(storedPending))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('epx_admin_auth')
    navigate('/login')
  }

  const handleApprove = (app: any) => {
    const newSpeaker: Speaker = {
      id: app.id,
      firstName: app.firstName,
      lastName: app.lastName,
      title: app.title,
      company: app.company,
      bio: app.bio,
      type: app.speakerType as any,
      year: 2026,
      photoUrl: null, // They didn't upload in our demo, falls back to initials
      linkedin: app.linkedIn
    }

    // Update Live Database
    const updatedLive = [newSpeaker, ...liveSpeakers]
    setLiveSpeakers(updatedLive)
    localStorage.setItem('epx_live_speakers', JSON.stringify(updatedLive))

    // Remove from Pending
    const updatedPending = pendingApps.filter(p => p.id !== app.id)
    setPendingApps(updatedPending)
    localStorage.setItem('epx_pending_speakers', JSON.stringify(updatedPending))
  }

  const handleReject = (id: string) => {
    const updatedPending = pendingApps.filter(p => p.id !== id)
    setPendingApps(updatedPending)
    localStorage.setItem('epx_pending_speakers', JSON.stringify(updatedPending))
  }

  const upcomingSpeakers = liveSpeakers.filter(s => s.year >= 2026)
  const pastSpeakers = liveSpeakers.filter(s => s.year < 2026)

  return (
    <div className="flex min-h-screen bg-ink-50">
      {editingSpeaker && (
        <EditSpeakerModal
          speaker={editingSpeaker}
          onClose={() => setEditingSpeaker(null)}
        />
      )}

      {reviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={() => setReviewingApp(null)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[24px] bg-white shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 sm:px-8 sm:py-6">
              <h2 className="font-display text-2xl font-bold text-heading">Review Application</h2>
              <button onClick={() => setReviewingApp(null)} className="rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Name</p>
                  <p className="mt-1 text-lg font-bold text-heading">{reviewingApp.firstName} {reviewingApp.lastName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Email</p>
                  <p className="mt-1 text-lg font-medium text-heading">{reviewingApp.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Role & Company</p>
                  <p className="mt-1 text-lg font-bold text-heading">{reviewingApp.title} at {reviewingApp.company}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Phone</p>
                  <p className="mt-1 text-lg font-medium text-heading">{reviewingApp.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">LinkedIn</p>
                  <a href={reviewingApp.linkedIn} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-lg font-medium text-red-500 hover:underline">{reviewingApp.linkedIn}</a>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Speaker Type</p>
                  <span className="mt-2 inline-flex items-center rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700 ring-1 ring-inset ring-orange-600/20">{reviewingApp.speakerType}</span>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Expertise Tags</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {reviewingApp.tags.split(',').map((tag: string, i: number) => (
                      <span key={i} className="rounded-md bg-ink-50 px-2.5 py-1.5 text-sm font-bold text-ink-600 ring-1 ring-inset ring-ink-200/50">{tag.trim()}</span>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Bio</p>
                  <p className="mt-2 text-base leading-relaxed text-body">{reviewingApp.bio}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-ink-100 bg-ink-50/50 px-6 py-4 sm:px-8">
              <button 
                onClick={() => {
                  handleReject(reviewingApp.id);
                  setReviewingApp(null);
                }} 
                className="rounded-xl px-5 py-2.5 font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                Reject Application
              </button>
              <button 
                onClick={() => {
                  handleApprove(reviewingApp);
                  setReviewingApp(null);
                }} 
                className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-2.5 font-bold text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md"
              >
                <Check className="h-4 w-4" />
                Approve Speaker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-ink-200 bg-white shadow-xl">
        <div className="flex h-20 items-center border-b border-ink-100 px-8">
          <Logo tone="dark" />
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <p className="mb-4 px-4 text-xs font-bold tracking-widest text-ink-400 uppercase">Management</p>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-ink-900 text-white shadow-md'
                  : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                Pending Apps
              </div>
              {pendingApps.length > 0 && (
                <span className={`flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-xs ${activeTab === 'pending' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'}`}>
                  {pendingApps.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-ink-900 text-white shadow-md'
                  : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
              }`}
            >
              <Users className="h-5 w-5" />
              2026 Speakers
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                activeTab === 'past'
                  ? 'bg-ink-900 text-white shadow-md'
                  : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
              }`}
            >
              <Calendar className="h-5 w-5" />
              Past Speakers
            </button>
          </nav>
        </div>

        <div className="border-t border-ink-100 p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-8 xl:p-12">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-heading">
              {activeTab === 'pending' && 'Pending Applications'}
              {activeTab === 'upcoming' && '2026 Roster'}
              {activeTab === 'past' && 'Past Speakers'}
            </h1>
            <p className="mt-2 text-lg text-body">
              {activeTab === 'pending' && 'Review and approve incoming speaker requests.'}
              {activeTab === 'upcoming' && 'Manage the active roster for the upcoming expo.'}
              {activeTab === 'past' && 'Archive of past event speakers.'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <input type="text" placeholder="Search records..." className="h-12 w-64 rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-sm font-medium transition-all focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10" />
            </div>
            <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-500 transition-colors hover:bg-ink-50">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Data Grid */}
        <div className="overflow-hidden rounded-[24px] border border-ink-200 bg-white shadow-xl shadow-ink-900/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/50 text-xs font-bold uppercase tracking-widest text-ink-400">
              <tr>
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Role & Company</th>
                <th className="px-8 py-5">Type / Tag</th>
                {activeTab === 'pending' && <th className="px-8 py-5">Contact</th>}
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              
              {/* Render Pending */}
              {activeTab === 'pending' && pendingApps.map((app) => (
                <tr key={app.id} className="group transition-colors hover:bg-ink-50/50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 ring-4 ring-white">
                        {app.firstName[0]}{app.lastName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-heading text-base">{app.firstName} {app.lastName}</div>
                        <div className="text-xs font-medium text-ink-400 mt-0.5">Applied {new Date(app.dateAdded).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-heading">{app.title}</div>
                    <div className="text-ink-500 font-medium">{app.company}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 ring-1 ring-inset ring-orange-600/20">
                      {app.speakerType}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-medium text-heading">{app.email}</div>
                    <div className="text-ink-400">{app.phone}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setReviewingApp(app)} 
                      className="inline-flex items-center gap-1 text-sm font-bold text-red-500 opacity-0 transition-opacity hover:text-red-700 group-hover:opacity-100"
                    >
                      Review <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {activeTab === 'pending' && pendingApps.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-ink-300" />
                    <h3 className="font-display text-lg font-bold text-heading">All caught up</h3>
                    <p className="mt-1 text-ink-500">There are no pending applications to review.</p>
                  </td>
                </tr>
              )}

              {/* Render Upcoming / Past */}
              {(activeTab === 'upcoming' ? upcomingSpeakers : activeTab === 'past' ? pastSpeakers : []).map((speaker) => (
                <tr key={speaker.id} className="group transition-colors hover:bg-ink-50/50">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ink-200 ring-4 ring-white">
                        {speaker.photoUrl ? (
                          <img src={speaker.photoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-900 font-bold text-white">
                            {speaker.firstName[0]}{speaker.lastName[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-heading text-base">{speaker.firstName} {speaker.lastName}</div>
                        {speaker.country && <div className="text-xs font-medium text-ink-400 mt-0.5">{speaker.country}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-heading">{speaker.title}</div>
                    <div className="text-ink-500 font-medium">{speaker.company}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex rounded-lg bg-ink-100 px-3 py-1.5 text-xs font-bold text-ink-900">
                      {speaker.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => setEditingSpeaker(speaker)}
                      className="inline-flex items-center gap-1 text-sm font-bold text-red-500 opacity-0 transition-opacity hover:text-red-700 group-hover:opacity-100"
                    >
                      Manage <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
