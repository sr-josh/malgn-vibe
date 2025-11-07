import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import InterestCalculator from './components/InterestCalculator'
import DdayCalculator from './components/DdayCalculator'
import UnitConverter from './components/UnitConverter'
import About from './pages/About'
import Board from './pages/Board'

function MainPage() {
  const [activeTab, setActiveTab] = useState('interest')

  const calculators = [
    { id: 'interest', name: '이자 계산기', icon: '💰' },
    { id: 'dday', name: 'D-day 계산기', icon: '📅' },
    { id: 'unit', name: '미국 단위 변환', icon: '🇺🇸' },
  ]

  const renderCalculator = () => {
    switch (activeTab) {
      case 'interest':
        return <InterestCalculator />
      case 'dday':
        return <DdayCalculator />
      case 'unit':
        return <UnitConverter />
      default:
        return <InterestCalculator />
    }
  }

  return (
    <>
      <header className="app-header">
        <Link to="/" className="header-title">
          <h1>GPT보다 똑똑한 계산기, 계미나이</h1>
        </Link>
      </header>

      <nav className="calculator-tabs">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            className={`tab-button ${activeTab === calc.id ? 'active' : ''}`}
            onClick={() => setActiveTab(calc.id)}
          >
            <span className="tab-icon">{calc.icon}</span>
            <span className="tab-name">{calc.name}</span>
          </button>
        ))}
      </nav>

      <main className="calculator-content">
        {renderCalculator()}
      </main>
    </>
  )
}

function Footer() {
  const location = useLocation()
  const isMainPage = location.pathname === '/'

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/about" className="footer-link">소개</Link>
          <span className="footer-divider">|</span>
          <Link to="/board" className="footer-link">게시판</Link>
          {!isMainPage && (
            <>
              <span className="footer-divider">|</span>
              <Link to="/" className="footer-link">홈으로</Link>
            </>
          )}
        </div>
        <div className="footer-info">
          <p>Made by josh</p>
          <p>Powered by Cloudflare Pages & Workers</p>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/board" element={<Board />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
