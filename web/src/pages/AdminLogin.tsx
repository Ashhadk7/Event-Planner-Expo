import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { Label, TextInput } from '../components/ui/Field'
import { Lock, ArrowRight, ShieldCheck, LayoutGrid, Users, Sparkles } from 'lucide-react'
import { adminLogin } from '../lib/api'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await adminLogin(password);
      navigate('/admin');
    } catch (err) {
      setError('Incorrect password. Please try again.');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper-2">
      {/* Brand showcase */}
      <aside className="band-dark grain relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col">
        <div className="relative z-10 flex h-full flex-col p-12">
          <Link to="/2026-speakers" aria-label="The Event Planner Expo — home">
            <Logo tone="light" />
          </Link>
          <div className="my-auto max-w-md">
            <span className="kicker text-gold-400">Control Room</span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-white">
              Manage the stage,{' '}
              <span className="serif-accent text-gold-400">end to end.</span>
            </h2>
            <p className="mt-5 leading-relaxed text-white/60">
              Review applications, curate the roster and keep both speaker portals up to date — all from one place.
            </p>
            <ul className="mt-10 space-y-4">
              {[
                { Icon: LayoutGrid, label: 'Approve & publish speakers instantly' },
                { Icon: Users, label: 'Manage the 2026 and past rosters' },
                { Icon: Sparkles, label: 'Edit profiles, types and visibility' },
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

      {/* Login form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo tone="dark" />
          </div>

          <div className="animate-fade-up rounded-2xl border border-line bg-white p-8 shadow-[0_24px_60px_-32px_rgba(7,10,51,0.4)] sm:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-ink-700 text-white shadow-[0_14px_34px_-14px_rgba(0,4,72,0.7)]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-heading">
                Admin access
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-body">
                Enter your credentials to manage the speaker roster.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="password" required>
                  Master password
                </Label>
                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-colors group-focus-within:text-ink-700" />
                  <TextInput
                    id="password"
                    type="password"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="••••••••"
                    className={`pl-11 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : ''}`}
                  />
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    error ? 'mt-2.5 max-h-10 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[13px] font-semibold text-red-600">{error}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-500 text-sm font-semibold text-white shadow-[0_14px_34px_-12px_rgba(232,25,44,0.55)] transition-all duration-300 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Authenticating…
                  </>
                ) : (
                  <>
                    Secure login
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[13px] text-muted">
            Demo password: <span className="font-semibold text-body">admin123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
