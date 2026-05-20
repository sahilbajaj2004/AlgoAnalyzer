import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home'
import Compare from './pages/Compare'
import Analyze from './pages/Analyze'
import AnalyzeV2 from './pages/Analyzev2.jsx'
import Admin from './pages/Admin'

const ANNOUNCEMENT_KEY = 'algoanalyzer_announcement_dismissed'

function AnnouncementModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="announcement-modal" role="dialog" aria-modal="true">
      <div className="announcement-modal__backdrop" onClick={onClose} />
      <div className="announcement-modal__content" role="document">
        <h2 className="announcement-modal__title">Important Notice</h2>
        <p className="announcement-modal__text">
          Free backend deployment plan khatam ho gaya, toh please source code apne PC par download karke use karein.
        </p>
        <button className="announcement-modal__button" onClick={onClose}>
          OK, samajh gaya
        </button>
      </div>
    </div>
  )
}

function App() {
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(ANNOUNCEMENT_KEY)
    if (!dismissed) {
      setShowAnnouncement(true)
    }
  }, [])

  const handleCloseAnnouncement = () => {
    localStorage.setItem(ANNOUNCEMENT_KEY, 'true')
    setShowAnnouncement(false)
  }

  return (
    <BrowserRouter>
      <AnnouncementModal isOpen={showAnnouncement} onClose={handleCloseAnnouncement} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/visualize" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path='/analyze' element={<Analyze />} />
        <Route path="/analyze-v2" element={<AnalyzeV2 />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App