import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home'
import Compare from './pages/Compare'
import Analyze from './pages/Analyze'
import AnalyzeV2 from './pages/Analyzev2.jsx'
import Admin from './pages/Admin'


function App() {
  return (
    <BrowserRouter>
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