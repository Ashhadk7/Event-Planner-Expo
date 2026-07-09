import { Navigate, Route, Routes } from 'react-router-dom'
import { PORTALS } from './data/portals'
import { SpeakerHub } from './pages/SpeakerHub'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLogin } from './pages/AdminLogin'
import { SpeakerSignup } from './pages/SpeakerSignup'
import { SpeakerPortal } from './pages/SpeakerPortal'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PORTALS.upcoming.path} replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<SpeakerSignup />} />
      <Route path="/speaker/:token" element={<SpeakerPortal />} />
      <Route
        path={PORTALS.upcoming.path}
        element={<SpeakerHub portal={PORTALS.upcoming} />}
      />
      <Route
        path={PORTALS.past.path}
        element={<SpeakerHub portal={PORTALS.past} />}
      />
      <Route path="*" element={<Navigate to={PORTALS.upcoming.path} replace />} />
    </Routes>
  )
}

export default App
