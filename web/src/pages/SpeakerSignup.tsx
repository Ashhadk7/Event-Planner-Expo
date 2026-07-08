import { useState } from 'react'
import { Logo } from '../components/ui/Logo'
import { UploadCloud, CheckCircle2 } from 'lucide-react'

export function SpeakerSignup() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper-1 p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-heading">
            Application Received!
          </h1>
          <p className="mt-4 text-lg text-body">
            Thank you for applying to speak at The Event Planner Expo. Our team will review your profile and reach out shortly.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-8 rounded-full bg-ink-900 px-8 py-3.5 font-bold text-white transition-colors hover:bg-ink-800"
          >
            Return to Expo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-1">
      {/* Simple Header */}
      <header className="flex h-20 items-center justify-center bg-white border-b border-line">
        <Logo tone="dark" />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-heading md:text-5xl">
            Speaker Application
          </h1>
          <p className="mt-4 text-lg text-body">
            Join the stage at the #1 trade show for event professionals in NYC.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-line bg-white p-6 shadow-xl md:p-10">
          <div className="space-y-8">
            
            {/* Section 1: Personal Info */}
            <div>
              <h2 className="mb-5 border-b border-line pb-2 font-display text-xl font-bold text-heading">
                Personal Information
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">First Name *</label>
                  <input required type="text" className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Last Name *</label>
                  <input required type="text" className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Title *</label>
                  <input required type="text" placeholder="e.g. CEO & Founder" className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Company *</label>
                  <input required type="text" className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">LinkedIn Profile *</label>
                  <input required type="url" placeholder="https://linkedin.com/in/..." className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Country</label>
                  <input type="text" className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>
              </div>
            </div>

            {/* Section 2: Contact Info */}
            <div>
              <h2 className="mb-5 border-b border-line pb-2 font-display text-xl font-bold text-heading">
                Contact Details (Private)
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Email Address *</label>
                  <input required type="email" className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Cell Phone *</label>
                  <input required type="tel" className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>
              </div>
            </div>

            {/* Section 3: Profile */}
            <div>
              <h2 className="mb-5 border-b border-line pb-2 font-display text-xl font-bold text-heading">
                Speaker Profile
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Speaker Type *</label>
                  <select required className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500">
                    <option value="">Select your role...</option>
                    <option value="Main Day">Main Day Speaker</option>
                    <option value="Fireside Chat">Fireside Chat</option>
                    <option value="Founder">Founder</option>
                    <option value="Influencer">Influencer</option>
                    <option value="Ambassador">Ambassador</option>
                    <option value="Sponsor">Sponsor</option>
                  </select>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Short Bio (max 250 words)</label>
                  <textarea rows={5} className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500"></textarea>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Expertise Tags</label>
                  <input type="text" placeholder="e.g. Leadership, Marketing, AI (comma separated)" className="w-full rounded-xl border border-line bg-paper-1 px-4 py-3 text-sm outline-none transition-colors focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500" />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-heading">Professional Headshot</label>
                  <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-paper-1 py-10 transition-colors hover:border-red-500 hover:bg-red-50/50">
                    <UploadCloud className="mb-3 h-10 w-10 text-muted" />
                    <p className="mb-1 text-sm font-semibold text-heading">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted">SVG, PNG, JPG or GIF (max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <label className="mb-6 flex items-start gap-3">
                <input required type="checkbox" className="mt-1 h-4 w-4 rounded border-line text-red-500 focus:ring-red-500" />
                <span className="text-sm text-body">
                  I agree to be featured on The Event Planner Expo website and consent to having my profile information displayed publicly.
                </span>
              </label>
              
              <button type="submit" className="w-full rounded-xl bg-red-500 py-4 font-bold text-white transition-colors hover:bg-red-600 md:text-lg">
                Submit Application
              </button>
            </div>

          </div>
        </form>
      </main>
    </div>
  )
}
