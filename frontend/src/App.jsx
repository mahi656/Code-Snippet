import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import FrontAnimate from '../FrontAnimate/FrontAnimate'
import Login from "../Login/Login.jsx"
import Signup from "../Signup/Signup.jsx"
import Dashboard from "./components/ui/dashboard-with-collapsible-sidebar.tsx"

function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          className: 'bg-[#18181b] text-white border border-[#27272a] rounded-2xl shadow-2xl font-sans text-sm font-medium px-4 py-3',
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a',
            borderRadius: '1rem',
          },
          success: {
            iconTheme: {
              primary: '#a78bfa',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }} 
      />
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
    </>
  )
}

export default App
