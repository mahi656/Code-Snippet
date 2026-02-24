import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import FrontAnimate from './FrontAnimate/FrontAnimate'
import { SignInPage } from "./components/UI/sign-in-flow-1"
import Login from "../Login/Login.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontAnimate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
