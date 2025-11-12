import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import InterestCalculator from './components/InterestCalculator'
import DdayCalculator from './components/DdayCalculator'
import UnitConverter from './components/UnitConverter'
import ExchangeCalculator from './components/ExchangeCalculator'
import CryptoCalculator from './components/CryptoCalculator'
import About from './pages/About'
import Board from './pages/Board'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'

function MainPage() {
  const [activeTab, setActiveTab] = useState('interest')

  const calculators = [
    { id: 'interest', name: '이자 계산기', icon: '💰' },
    { id: 'dday', name: 'D-day 계산기', icon: '📅' },
    { id: 'unit', name: '미국 단위 변환', icon: '🇺🇸' },
    { id: 'exchange', name: '환율 계산기', icon: '💱' },
    { id: 'crypto', name: '암호화', icon: '🔐' },
  ]

  const renderCalculator = () => {
    switch (activeTab) {
      case 'interest':
        return <InterestCalculator />
      case 'dday':
        return <DdayCalculator />
      case 'unit':
        return <UnitConverter />
      case 'exchange':
        return <ExchangeCalculator />
      case 'crypto':
        return <CryptoCalculator />
      default:
        return <InterestCalculator />
    }
  }

  return (
    <>
      <header className="app-header">
        <h1>GPT보다 똑똑한 계산기, 계미나이</h1>
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
          <span className="footer-divider">|</span>
          <Link to="/contact" className="footer-link">문의하기</Link>
          {!isMainPage && (
            <>
              <span className="footer-divider">|</span>
              <Link to="/" className="footer-link">홈으로</Link>
            </>
          )}
        </div>
        <div className="footer-links" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <Link to="/privacy" className="footer-link">개인정보처리방침</Link>
          <span className="footer-divider">|</span>
          <Link to="/terms" className="footer-link">이용약관</Link>
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
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
