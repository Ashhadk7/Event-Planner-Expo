import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { Lock } from 'lucide-react'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple mock authentication (will be replaced with real backend auth later)
    if (password === 'admin123') {
      localStorage.setItem('epx_admin_auth', 'true')
      navigate('/admin')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper-1">
      {/* Header */}
      <header className="flex h-20 items-center justify-center border-b border-line bg-white">
        <Logo tone="dark" />
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink-900 shadow-lg">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-heading">
              Admin Portal
            </h1>
            <p className="mt-2 text-body">
              Restricted access. Please enter the master password to manage speakers.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-line bg-white p-8 shadow-xl"
          >
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-heading">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className={`w-full rounded-xl border bg-paper-1 px-4 py-3.5 text-sm outline-none transition-colors focus:bg-white focus:ring-1 ${
                  error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-line focus:border-ink-900 focus:ring-ink-900'
                }`}
                placeholder="Enter password"
              />
              {error && <p className="mt-2 text-sm font-semibold text-red-500">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full rounded-xl bg-ink-900 py-3.5 font-bold text-white shadow-md transition-colors hover:bg-ink-800"
            >
              Log In
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-semibold text-muted">
            &copy; 2026 The Event Planner Expo. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  )
}
