import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import FrontAnimate from './FrontAnimate/FrontAnimate'
import { SignInPage } from "./components/UI/sign-in-flow-1"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontAnimate />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
