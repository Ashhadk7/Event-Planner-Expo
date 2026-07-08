import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { FieldRow, TextInput, TextArea, SelectInput } from '../components/ui/Field'
import { SPEAKER_TYPES } from '../data/speakerTypes'
import {
  CheckCircle2,
  Upload,
  Mail,
  ShieldCheck,
  UserRound,
  ArrowRight,
  ArrowLeft,
  Check,
  CalendarDays,
  MapPin,
  Sparkles,
} from 'lucide-react'

type Step = 'email' | 'otp' | 'form' | 'success'

const STEPS: { key: Step; label: string }[] = [
  { key: 'email', label: 'Email' },
  { key: 'otp', label: 'Verify' },
  { key: 'form', label: 'Profile' },
  { key: 'success', label: 'Done' },
]

const BIO_MAX = 250

export function SpeakerSignup() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    title: '',
    location: '',
    website: '',
    bio: '',
    linkedIn: '',
    speakerType: '',
    tags: '',
    photoUrl: '',
    consent: false,
  })

  const stepIndex = STEPS.findIndex((s) => s.key === step)

  useEffect(() => {
    if (step === 'otp') otpRefs.current[0]?.focus()
  }, [step])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep('otp')
    }, 800)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.join('').length !== 6) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep('form')
    }, 1000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      const pendingStr = localStorage.getItem('epx_pending_speakers') || '[]'
      const pending = JSON.parse(pendingStr)
      const newApplication = {
        id: `APP-${Date.now()}`,
        email,
        ...formData,
        status: 'pending',
        dateAdded: new Date().toISOString(),
      }
      localStorage.setItem(
        'epx_pending_speakers',
        JSON.stringify([newApplication, ...pending]),
      )
      setIsSubmitting(false)
      setStep('success')
    }, 1500)
  }

  const primaryBtn =
    'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red-500 px-7 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(232,25,44,0.55)] transition-all duration-300 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60'
  const ghostBtn =
    'inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold text-body transition-colors hover:text-heading'

  /* ---------------------------------------------------------------- steps */

  const renderEmailStep = () => (
    <div className="animate-fade-up mx-auto w-full max-w-md">
      <StepHeading
        icon={<Mail className="h-5 w-5" />}
        title="Let's get you on stage"
        subtitle="Enter your professional email to begin your speaker application."
      />
      <form
        onSubmit={handleEmailSubmit}
        className="rounded-2xl border border-line bg-white p-7 shadow-[0_18px_50px_-30px_rgba(7,10,51,0.35)]"
      >
        <FieldRow label="Email address" htmlFor="email" required>
          <TextInput
            id="email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </FieldRow>
        <button type="submit" disabled={isSubmitting || !email} className={`${primaryBtn} mt-6 w-full`}>
          {isSubmitting ? 'Sending code…' : 'Continue'}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )

  const renderOtpStep = () => (
    <div className="animate-fade-up mx-auto w-full max-w-md">
      <StepHeading
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Verify your email"
        subtitle={
          <>
            We sent a 6-digit code to <span className="font-semibold text-heading">{email}</span>.
          </>
        }
      />
      <form
        onSubmit={handleOtpSubmit}
        className="rounded-2xl border border-line bg-white p-7 shadow-[0_18px_50px_-30px_rgba(7,10,51,0.35)]"
      >
        <div className="mb-7 flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                otpRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${index + 1}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="h-14 w-full rounded-xl border border-line bg-white text-center text-xl font-bold text-heading outline-none transition-all duration-200 focus:border-ink-400 focus:ring-4 focus:ring-ink-700/10"
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setStep('email')} className={ghostBtn}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || otp.join('').length !== 6}
            className={primaryBtn}
          >
            {isSubmitting ? 'Verifying…' : 'Verify code'}
          </button>
        </div>
      </form>
      <p className="mt-5 text-center text-[13px] text-muted">
        Didn't get it? <span className="font-semibold text-red-600">Resend code</span>
      </p>
    </div>
  )

  const renderFormStep = () => (
    <div className="animate-fade-up mx-auto w-full max-w-2xl">
      <StepHeading
        icon={<UserRound className="h-5 w-5" />}
        title="Build your speaker profile"
        subtitle="This is what attendees will see. You can update it any time before the event."
      />

      <form
        onSubmit={handleFinalSubmit}
        className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_50px_-30px_rgba(7,10,51,0.35)]"
      >
        {/* Photo */}
        <div className="flex flex-col items-center gap-4 border-b border-line bg-paper-2/60 px-7 py-8 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-ink-600 to-ink-900 ring-1 ring-line">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-white/70">
                <Upload className="mb-1 h-5 w-5" />
                <span className="text-[10px] font-medium">Photo</span>
              </div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-heading">Profile photo</p>
            <p className="mt-0.5 text-[13px] text-muted">Square JPG or PNG, up to 5MB. Optional but recommended.</p>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white px-4 text-[13px] font-semibold text-heading shadow-sm transition-colors hover:border-ink-300 hover:bg-paper-2"
            >
              <Upload className="h-3.5 w-3.5" />
              {formData.photoUrl ? 'Replace photo' : 'Upload photo'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-5 px-7 py-7 sm:grid-cols-2">
          <FieldRow label="First name" htmlFor="firstName" required>
            <TextInput id="firstName" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Mario" />
          </FieldRow>
          <FieldRow label="Last name" htmlFor="lastName" required>
            <TextInput id="lastName" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Stewart" />
          </FieldRow>

          <FieldRow label="Email" htmlFor="emailRO">
            <TextInput id="emailRO" type="email" disabled value={email} />
          </FieldRow>
          <FieldRow label="Cell phone" htmlFor="phone" required>
            <TextInput id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
          </FieldRow>

          <FieldRow label="Professional title" htmlFor="title" required>
            <TextInput id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Founder & CEO" />
          </FieldRow>
          <FieldRow label="Company" htmlFor="company" required>
            <TextInput id="company" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Stewart Experiential" />
          </FieldRow>

          <FieldRow label="Speaker type" htmlFor="speakerType" required>
            <SelectInput id="speakerType" required value={formData.speakerType} onChange={(e) => setFormData({ ...formData, speakerType: e.target.value })}>
              <option value="" disabled>Select a type…</option>
              {SPEAKER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </SelectInput>
          </FieldRow>
          <FieldRow label="Location" htmlFor="location">
            <TextInput id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="New York, USA" />
          </FieldRow>

          <FieldRow label="LinkedIn URL" htmlFor="linkedIn" required className="sm:col-span-2">
            <TextInput id="linkedIn" type="url" required value={formData.linkedIn} onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })} placeholder="https://linkedin.com/in/username" />
          </FieldRow>

          <FieldRow label="Website" htmlFor="website" className="sm:col-span-2">
            <TextInput id="website" type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://yourcompany.com" />
          </FieldRow>

          <FieldRow label="Areas of expertise" htmlFor="tags" hint="comma-separated" className="sm:col-span-2">
            <TextInput id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Event Planning, AI, Leadership" />
          </FieldRow>

          <FieldRow
            label="Short bio"
            htmlFor="bio"
            hint={`${formData.bio.length}/${BIO_MAX}`}
            className="sm:col-span-2"
          >
            <TextArea id="bio" maxLength={BIO_MAX} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell attendees what you'll bring to the stage…" />
          </FieldRow>

          <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
            <input
              type="checkbox"
              required
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-line text-red-500 accent-red-500 focus:ring-2 focus:ring-red-500/30"
            />
            <span className="text-[13px] leading-relaxed text-body">
              I agree to be featured on The Event Planner Expo website and confirm the information above is accurate.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between border-t border-line bg-paper-2/60 px-7 py-5">
          <button type="button" onClick={() => setStep('otp')} className={ghostBtn}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button type="submit" disabled={isSubmitting} className={primaryBtn}>
            {isSubmitting ? 'Submitting…' : 'Submit application'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="animate-fade-up mx-auto w-full max-w-lg text-center">
      <div className="rounded-2xl border border-line bg-white p-10 shadow-[0_18px_50px_-30px_rgba(7,10,51,0.35)] sm:p-12">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-green-50 ring-1 ring-green-600/15">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-heading">Application received</h1>
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-body">
          Our curation team will review your profile. If selected, we'll reach out directly at{' '}
          <span className="font-semibold text-heading">{email}</span>.
        </p>
        <Link to="/2026-speakers" className={`${primaryBtn} mt-8`}>
          Explore the 2026 lineup
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )

  /* ------------------------------------------------------------ layout */

  return (
    <div className="flex min-h-screen bg-paper-2 lg:h-screen lg:overflow-hidden">
      {/* Brand rail (desktop) — fixed full height */}
      <aside className="band-dark grain relative hidden w-[42%] max-w-xl shrink-0 overflow-hidden lg:flex lg:h-screen lg:flex-col">
        <div className="relative z-10 flex h-full flex-col p-12">
          <Link to="/2026-speakers" aria-label="The Event Planner Expo — home">
            <Logo tone="light" />
          </Link>

          <div className="my-auto max-w-md">
            <span className="kicker text-gold-400">Speaker Applications · 2026</span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-white">
              Share your story on the{' '}
              <span className="serif-accent text-gold-400">EPX stage.</span>
            </h2>
            <p className="mt-5 leading-relaxed text-white/60">
              Join the founders, innovators and industry leaders shaping the future of live events in New York City.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                { Icon: CalendarDays, label: 'October 27–29, 2026' },
                { Icon: MapPin, label: 'New York City' },
                { Icon: Sparkles, label: '2,500+ event professionals in the room' },
              ].map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-gold-400 ring-1 ring-white/10">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[13px] text-white/40">
            &copy; {new Date().getFullYear()} The Event Planner Expo
          </p>
        </div>
      </aside>

      {/* Form area — the only scrollable region on desktop */}
      <div className="premium-scroll flex min-h-screen flex-1 flex-col lg:h-screen lg:min-h-0 lg:overflow-y-auto">
        {/* mobile top bar */}
        <header className="flex h-16 items-center border-b border-line bg-white px-5 lg:hidden">
          <Link to="/2026-speakers" aria-label="The Event Planner Expo — home">
            <Logo tone="dark" />
          </Link>
        </header>

        <div className="flex flex-1 flex-col px-5 py-10 sm:px-10 sm:py-14">
          {step !== 'success' && (
            <div className="mx-auto mb-12 w-full max-w-2xl">
              <Stepper current={stepIndex} />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-center">
            {step === 'email' && renderEmailStep()}
            {step === 'otp' && renderOtpStep()}
            {step === 'form' && renderFormStep()}
            {step === 'success' && renderSuccessStep()}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- helpers */

function StepHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: React.ReactNode
}) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-ink-700 text-white shadow-[0_12px_30px_-12px_rgba(0,4,72,0.6)]">
        {icon}
      </div>
      <h1 className="font-display text-[28px] font-bold tracking-tight text-heading">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-body">{subtitle}</p>
    </div>
  )
}

function Stepper({ current }: { current: number }) {
  const visible = STEPS.slice(0, 3) // Email · Verify · Profile
  const cur = Math.min(current, visible.length - 1)
  return (
    <div className="flex items-center">
      {visible.map((s, i) => {
        const done = i < cur
        const active = i === cur
        return (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold transition-colors duration-300 ${
                  done
                    ? 'bg-ink-700 text-white'
                    : active
                      ? 'bg-red-500 text-white shadow-[0_8px_20px_-8px_rgba(232,25,44,0.6)]'
                      : 'bg-white text-muted ring-1 ring-line'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`hidden text-[13px] font-semibold sm:inline ${
                  active ? 'text-heading' : done ? 'text-body' : 'text-muted'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < visible.length - 1 && (
              <span className="mx-3 h-0.5 flex-1 rounded-full bg-line">
                <span
                  className={`block h-full rounded-full bg-ink-700 transition-all duration-500 ${
                    done ? 'w-full' : 'w-0'
                  }`}
                />
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
