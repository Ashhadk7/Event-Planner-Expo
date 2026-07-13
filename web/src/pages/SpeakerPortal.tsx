import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ImagePlus,
  Loader2,
  Lock,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { speakerLogin, speakerToken, getMe, saveMe, uploadPhoto } from '../lib/api'
import { SPEAKER_TYPES } from '../data/speakerTypes'
import { Logo } from '../components/ui/Logo'
import { FieldRow, TextInput, TextArea, SelectInput } from '../components/ui/Field'

const EMPTY = {
  firstName: '',
  lastName: '',
  title: '',
  company: '',
  country: '',
  bio: '',
  expertise: [] as string[],
  photoUrl: '',
  linkedin: '',
  type: 'Founder',
  year: 2026,
}

export function SpeakerPortal() {
  const { token = '' } = useParams()
  const [authed, setAuthed] = useState(!!speakerToken())
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [profile, setProfile] = useState<typeof EMPTY>(EMPTY)
  const [hasPending, setHasPending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!authed) return
    getMe()
      .then((d) => {
        if (d.profile) setProfile({ ...EMPTY, ...d.profile })
        setHasPending(d.hasPending)
      })
      .catch(() => setAuthed(false))
  }, [authed])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoggingIn(true)
    try {
      await speakerLogin(token, password)
      setAuthed(true)
    } catch {
      setError('Incorrect password. Please check your invite email.')
      setPassword('')
    } finally {
      setLoggingIn(false)
    }
  }

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) =>
    setProfile((p) => ({ ...p, [k]: v }))

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploading(true)
    setError('')
    try {
      set('photoUrl', await uploadPhoto(f))
    } catch (err: any) {
      setError(err?.message || 'Photo upload failed. Try a smaller image.')
    } finally {
      setUploading(false)
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      await saveMe({ ...profile, year: Number(profile.year) })
      setSaved(true)
      setHasPending(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err?.message || 'Could not save. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  // ---- Login gate -----------------------------------------------------------
  if (!authed) {
    return (
      <div className="flex min-h-screen bg-paper-2">
        {/* Brand showcase */}
        <aside className="band-dark grain relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col">
          <div className="relative z-10 flex h-full flex-col p-12">
            <Link to="/2026-speakers" aria-label="The Event Planner Expo — home">
              <Logo tone="light" />
            </Link>
            <div className="my-auto max-w-md">
              <span className="kicker text-gold-400">Speaker Portal</span>
              <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-white">
                Your profile,{' '}
                <span className="serif-accent text-gold-400">your stage.</span>
              </h2>
              <p className="mt-5 leading-relaxed text-white/60">
                Log in with the password from your invite email to add or update
                your speaker profile. Every change is reviewed before it goes live.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  { Icon: UserRound, label: 'Add your bio, title and headshot' },
                  { Icon: Sparkles, label: 'Showcase your expertise' },
                  { Icon: Clock, label: 'Edit anytime with the same link' },
                ].map(({ Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-sm text-white/80"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-gold-400 ring-1 ring-white/10">
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Login form */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo tone="dark" />
            </div>
            <div className="animate-fade-up rounded-2xl border border-line bg-white p-8 shadow-[0_24px_60px_-32px_rgba(7,10,51,0.4)] sm:p-10">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-ink-700 text-white shadow-[0_14px_34px_-14px_rgba(0,4,72,0.7)]">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="font-display text-2xl font-bold text-heading">
                Speaker Portal
              </h1>
              <p className="mt-1.5 text-sm text-body">
                Enter the password from your invite email to continue.
              </p>

              <form onSubmit={login} className="mt-7 space-y-4">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <TextInput
                    type="password"
                    autoFocus
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-11 ${
                      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : ''
                    }`}
                  />
                </div>

                {error && (
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loggingIn || !password}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-500 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(232,25,44,0.55)] transition-all duration-300 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loggingIn ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    'Enter portal'
                  )}
                </button>
              </form>
            </div>
            <p className="mt-6 text-center text-[13px] text-muted">
              Lost your link or password? Ask the organiser to re-send your invite.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ---- Profile form ---------------------------------------------------------
  const initials =
    `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-paper-2">
      {/* Top bar */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Logo tone="dark" />
          <span className="hidden text-[13px] font-medium text-muted sm:block">
            Speaker Portal
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <span className="kicker text-red-500">Your profile</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-heading">
            {profile.firstName ? `Welcome, ${profile.firstName}` : 'Your speaker profile'}
          </h1>
          <p className="mt-1.5 text-body">
            Fill in your details below. Changes are reviewed by the organiser
            before they appear on the public site.
          </p>
        </div>

        {/* Status banners */}
        {saved && (
          <div className="animate-fade-up mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">Saved successfully</p>
              <p className="text-[13px] text-green-700">
                Your changes are now awaiting the organiser's approval.
              </p>
            </div>
          </div>
        )}
        {hasPending && !saved && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-gold-400/50 bg-gold-400/10 px-4 py-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
            <div>
              <p className="text-sm font-semibold text-heading">Awaiting approval</p>
              <p className="text-[13px] text-body">
                You have changes pending review. The public site shows your last
                approved version until they're approved.
              </p>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={save} className="space-y-6">
          {/* Headshot card */}
          <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_1px_3px_rgba(7,10,51,0.04)]">
            <h2 className="text-sm font-semibold text-heading">Headshot</h2>
            <div className="mt-4 flex items-center gap-5">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt="Your headshot"
                  className="h-20 w-20 rounded-2xl object-cover ring-1 ring-line"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-ink-700 text-xl font-bold text-white">
                  {initials}
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-semibold text-heading transition-colors hover:border-ink-400 hover:bg-paper-2">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {uploading ? 'Uploading…' : profile.photoUrl ? 'Replace photo' : 'Upload photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPhoto}
                  disabled={uploading}
                />
              </label>
            </div>
          </section>

          {/* Details card */}
          <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_1px_3px_rgba(7,10,51,0.04)]">
            <h2 className="text-sm font-semibold text-heading">Your details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldRow label="First name" required>
                <TextInput
                  placeholder="Jane"
                  value={profile.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Last name" required>
                <TextInput
                  placeholder="Doe"
                  value={profile.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Job title" required>
                <TextInput
                  placeholder="Founder & CEO"
                  value={profile.title}
                  onChange={(e) => set('title', e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Company" required>
                <TextInput
                  placeholder="Acme Events"
                  value={profile.company}
                  onChange={(e) => set('company', e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Country">
                <TextInput
                  placeholder="United States"
                  value={profile.country}
                  onChange={(e) => set('country', e.target.value)}
                />
              </FieldRow>
              <FieldRow label="LinkedIn" hint="URL or username">
                <TextInput
                  placeholder="jane-doe"
                  value={profile.linkedin}
                  onChange={(e) => set('linkedin', e.target.value)}
                />
              </FieldRow>
              <FieldRow label="Speaker type" required>
                <SelectInput
                  value={profile.type}
                  onChange={(e) => set('type', e.target.value)}
                >
                  {SPEAKER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectInput>
              </FieldRow>
              <FieldRow label="Expo year" required>
                <TextInput
                  type="number"
                  placeholder="2026"
                  value={profile.year}
                  onChange={(e) => set('year', Number(e.target.value) as any)}
                />
              </FieldRow>
              <FieldRow
                label="Areas of expertise"
                hint="comma separated"
                className="sm:col-span-2"
              >
                <TextInput
                  placeholder="Corporate Events, Marketing, Team Building"
                  value={profile.expertise.join(', ')}
                  onChange={(e) =>
                    set(
                      'expertise',
                      e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </FieldRow>
              <FieldRow label="Bio" className="sm:col-span-2">
                <TextArea
                  rows={5}
                  placeholder="Tell attendees about your background, what you speak on, and why they should catch your session."
                  value={profile.bio}
                  onChange={(e) => set('bio', e.target.value)}
                />
              </FieldRow>
            </div>
          </section>

          {/* Save bar */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-[13px] text-muted">
              Every change is reviewed before it goes live.
            </p>
            <button
              type="submit"
              disabled={busy || uploading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-500 px-8 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(232,25,44,0.55)] transition-all duration-300 hover:bg-red-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {busy ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving…
                </>
              ) : (
                'Save (pending approval)'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
