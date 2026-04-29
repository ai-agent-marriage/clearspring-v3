import React from 'react'
import { Routes, Route } from 'react-router-dom'
import QualificationReviewH5 from './pages/QualificationReviewH5'
import AppealArbitrationH5 from './pages/AppealArbitrationH5'

function App() {
  return (
    <Routes>
      <Route path="/" element={<QualificationReviewH5 />} />
      <Route path="/qualifications" element={<QualificationReviewH5 />} />
      <Route path="/appeals" element={<AppealArbitrationH5 />} />
    </Routes>
  )
}

export default App
