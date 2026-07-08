import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      if (password === 'admin123') {
        localStorage.setItem('epx_admin_auth', 'true')
        navigate('/admin')
      } else {
        setError('Incorrect password. Please try again.')
        setPassword('')
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-ink-900 selection:bg-red-500 selection:text-white">
      {/* Premium Dark Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--twinkle-color)_0%,_transparent_60%)] opacity-30 [--twinkle-color:theme(colors.ink.500)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--twinkle-color)_0%,_transparent_60%)] opacity-20 [--twinkle-color:theme(colors.red.600)]" />
      <div className="grain absolute inset-0 opacity-40 mix-blend-overlay" />

      <div className="relative z-10 w-full max-w-[420px] px-6">
        {/* Logo */}
        <div className="mb-12 flex justify-center animate-fade-up">
          <Logo tone="light" />
        </div>

        {/* Login Card */}
        <div className="animate-fade-up overflow-hidden rounded-[24px] bg-white/10 p-[1px] shadow-[0_0_80px_-20px_rgba(232,25,44,0.15)] backdrop-blur-xl" style={{ animationDelay: '100ms' }}>
          <div className="rounded-[23px] bg-ink-800/95 px-8 py-10 shadow-2xl backdrop-blur-2xl sm:px-10 sm:py-12">
            
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-700 to-ink-900 shadow-inner ring-1 ring-white/10">
                <ShieldCheck className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white">
                Admin <span className="text-red-500">Access</span>
              </h1>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink-200">
                Enter your secure credentials to manage the speaker roster.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-ink-300 uppercase">
                  Master Password
                </label>
                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-red-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    className={`w-full rounded-xl border bg-ink-900/80 py-4 pl-12 pr-4 text-white placeholder-ink-500 shadow-inner outline-none transition-all focus:bg-ink-900 focus:ring-4 ${
                      error
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/5 focus:border-red-500/50 focus:ring-red-500/20 hover:border-white/20'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Error Message */}
                <div className={`overflow-hidden transition-all duration-300 ${error ? 'mt-3 max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm font-semibold text-red-400">{error}</p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 px-6 py-4 font-bold text-white transition-all hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span className="tracking-wide">Secure Login</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
                <div className="ticket-shine opacity-40" />
              </button>
            </form>

          </div>
        </div>
        
        <p className="animate-fade-up mt-10 text-center text-sm font-medium text-ink-400" style={{ animationDelay: '200ms' }}>
          &copy; {new Date().getFullYear()} The Event Planner Expo
        </p>
      </div>
    </div>
  )
}
