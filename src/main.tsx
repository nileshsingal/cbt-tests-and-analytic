import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Instructions } from './pages/Instructions'
import { Exam } from './pages/Exam'
import { Results } from './pages/Results'
import './styles.css'

function DashboardSection() {
  const { section } = useParams()
  return section && ['available', 'pyqs', 'mocks', 'subjects', 'performance', 'history'].includes(section)
    ? <Dashboard section={section} />
    : <Navigate to="/" replace />
}
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><Routes>
  <Route path="/" element={<Dashboard />} /><Route path="/dashboard/:section" element={<DashboardSection />} />
  <Route path="/instructions/:testId?" element={<Instructions />} /><Route path="/exam/:id" element={<Exam />} />
  <Route path="/result/:id" element={<Results />} /><Route path="/solutions/:id" element={<Results key="solutions" solutions />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes></BrowserRouter></StrictMode>)