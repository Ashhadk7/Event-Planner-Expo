import { Navigate, Route, Routes } from 'react-router-dom'
import { PORTALS } from './data/portals'
import { SpeakerHub } from './pages/SpeakerHub'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PORTALS.upcoming.path} replace />} />
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
