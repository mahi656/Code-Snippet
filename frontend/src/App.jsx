import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import FrontAnimate from '../FrontAnimate/FrontAnimate'
import Login from "../Login/Login.jsx"
import Signup from "../Signup/Signup.jsx"
import Dashboard from "./components/ui/dashboard-with-collapsible-sidebar.tsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontAnimate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/qr-login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
