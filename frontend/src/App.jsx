import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import FrontAnimate from '../FrontAnimate/FrontAnimate.jsx'
import Login from "../Login/Login.jsx"
import Signup from "../Signup/Signup.jsx"
import Dashboard from "./components/ui/dashboard-with-collapsible-sidebar"
import QRVerify from "./components/auth/QRVerify.jsx"
import { Notification } from './components/ui/Notification.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Notification />
        <Routes>
          <Route path="/" element={<FrontAnimate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/qr-login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/qr-verify" element={<QRVerify />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
