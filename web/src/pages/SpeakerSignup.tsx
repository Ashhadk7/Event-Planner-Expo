import { useState, useRef, useEffect } from 'react'
import { Logo } from '../components/ui/Logo'
import { CheckCircle2, Upload } from 'lucide-react'

type Step = 'email' | 'otp' | 'form' | 'success'

export function SpeakerSignup() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form Data
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
    photoUrl: ''
  })

  useEffect(() => {
    if (step === 'otp') {
      otpRefs.current[0]?.focus()
    }
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

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullOtp = otp.join('')
    if (fullOtp.length !== 6) return
    
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
      setFormData(prev => ({ ...prev, photoUrl: reader.result as string }))
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
        dateAdded: new Date().toISOString()
      }
      localStorage.setItem('epx_pending_speakers', JSON.stringify([newApplication, ...pending]))
      
      setIsSubmitting(false)
      setStep('success')
    }, 1500)
  }

  const renderEmailStep = () => (
    <div className="mx-auto max-w-md mt-20 animate-fade-up">
      <div className="mb-8 text-center">
        <p className="text-sm text-gray-500 mb-2">You have been invited to join</p>
        <h1 className="font-serif text-4xl text-[#1a1a1a]">Enter Email</h1>
        <p className="mt-3 text-sm text-gray-500">
          Enter your professional email address to begin.
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 mb-6">
          <label className="text-[13px] font-medium text-gray-700">Email *</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:outline-none" 
          />
        </div>
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting || !email}
            className="rounded-full bg-[#1e4431] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#163625] disabled:opacity-70"
          >
            {isSubmitting ? 'Sending...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  )

  const renderOtpStep = () => (
    <div className="mx-auto max-w-md mt-20 animate-fade-up">
      <div className="mb-8 text-center">
        <p className="text-sm text-gray-500 mb-2">You have been invited to join</p>
        <h1 className="font-serif text-4xl text-[#1a1a1a]">Verify Email</h1>
        <p className="mt-3 text-sm text-gray-500">
          We sent a 6-digit code to {email}.
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="h-12 w-12 rounded-md border border-gray-300 text-center text-xl font-medium text-gray-800 transition-colors focus:border-gray-800 focus:outline-none"
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setStep('email')} className="text-sm text-gray-500 hover:text-gray-800">
            Back
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting || otp.join('').length !== 6}
            className="rounded-full bg-[#1e4431] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#163625] disabled:opacity-70"
          >
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      </form>
    </div>
  )

  const renderFormStep = () => (
    <div className="mx-auto max-w-[800px] mt-12 mb-20 animate-fade-up">
      <div className="mb-10 text-center">
        <p className="text-sm text-gray-500 mb-3">You have been invited to join</p>
        <h1 className="font-serif text-[38px] text-[#1a1a1a] tracking-tight">Build Your Profile</h1>
        <p className="mt-3 text-[14px] text-gray-500">
          Fill in your details — you can always update them later.
        </p>
      </div>

      <div className="rounded-[16px] border border-gray-200 bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        
        {/* Photo Upload Area */}
        <div className="mb-10">
          <div className="rounded-xl border border-dashed border-gray-300 bg-[#fcfcfc] py-8 flex flex-col items-center justify-center">
            <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="text-[10px] text-center px-2">No photo</span>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Change Photo
            </button>
            <p className="mt-3 text-[11px] text-gray-400">Optional — square photo recommended</p>
          </div>
        </div>

        <form onSubmit={handleFinalSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">First Name *</label>
              <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="h-10 w-full rounded-md border border-gray-300 bg-[#eff4ff] px-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:bg-white focus:outline-none" />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Last Name *</label>
              <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="h-10 w-full rounded-md border border-gray-300 bg-[#eff4ff] px-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:bg-white focus:outline-none" />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Email *</label>
              <input type="email" disabled value={email} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-500 cursor-not-allowed" />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Cell Phone *</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:outline-none" />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Company</label>
              <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:outline-none" />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Professional Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:outline-none" />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="h-10 w-full rounded-md border border-gray-300 bg-[#eff4ff] px-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:bg-white focus:outline-none" />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Website</label>
              <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:outline-none" />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">Bio</label>
              <textarea rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full rounded-md border border-gray-300 bg-white p-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:outline-none resize-none"></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[13px] font-medium text-gray-700">LinkedIn URL</label>
              <input type="url" value={formData.linkedIn} onChange={e => setFormData({...formData, linkedIn: e.target.value})} className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-[14px] text-gray-800 transition-colors focus:border-gray-800 focus:outline-none" />
            </div>

          </div>

          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="rounded-full bg-[#1e4431] px-8 py-2.5 text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-[#163625] focus:outline-none focus:ring-2 focus:ring-[#1e4431] focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Join The Circle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="mx-auto w-full max-w-lg mt-20 animate-fade-up">
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-[#1a1a1a]">
          Application Received
        </h1>
        <p className="mt-4 text-gray-600">
          Our curation team will review your profile. If selected, we will contact you directly at {email}.
        </p>
        
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-8 rounded-full bg-[#1e4431] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#163625]"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Header matching the brand style but very minimal */}
      <header className="flex h-16 items-center border-b border-gray-200 bg-white px-6">
        <Logo tone="dark" />
      </header>

      {/* Main Content Area */}
      <div className="px-4">
        {step === 'email' && renderEmailStep()}
        {step === 'otp' && renderOtpStep()}
        {step === 'form' && renderFormStep()}
        {step === 'success' && renderSuccessStep()}
      </div>
    </div>
  )
}
