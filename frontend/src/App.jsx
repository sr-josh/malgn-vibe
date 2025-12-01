import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import SalaryCalculator from './components/SalaryCalculator'
import InterestCalculator from './components/InterestCalculator'
import DdayCalculator from './components/DdayCalculator'
import UnitConverter from './components/UnitConverter'
import ExchangeCalculator from './components/ExchangeCalculator'
import CryptoCalculator from './components/CryptoCalculator'
import MarketIndex from './components/MarketIndex'
import IPOCalendar from './components/IPOCalendar'
import About from './pages/About'
import Board from './pages/Board'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'

function MainPage() {
  const [activeTab, setActiveTab] = useState('salary')
  const [showSpeechBubble, setShowSpeechBubble] = useState(false)
  const [speechText, setSpeechText] = useState('계빠르지!')
  const [messageIndex, setMessageIndex] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(15)
  const [calculators, setCalculators] = useState([
    { id: 'salary', name: '연봉 계산기', icon: '💵', click_count: 0 },
    { id: 'interest', name: '이자 계산기', icon: '💰', click_count: 0 },
    { id: 'dday', name: 'D-day 계산기', icon: '📅', click_count: 0 },
    { id: 'unit', name: '미국 단위 변환', icon: '🇺🇸', click_count: 0 },
    { id: 'exchange', name: '환율 계산기', icon: '💱', click_count: 0 },
    { id: 'crypto', name: '암호화', icon: '🔐', click_count: 0 },
    // { id: 'market', name: '주요 지수', icon: '📊', click_count: 0 },
    // { id: 'ipo', name: '공모주 일정', icon: '📅', click_count: 0 },
  ])

  const API_BASE = ''

  useEffect(() => {
    loadCalculatorStats()
  }, [])

  const loadCalculatorStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/calculator-stats`)
      if (response.ok) {
        const data = await response.json()
        if (data.calculators && data.calculators.length > 0) {
          // 공모주(ipo)와 주요지수(market) 제외
          const filteredCalculators = data.calculators.filter(
            calc => calc.id !== 'ipo' && calc.id !== 'market'
          )
          setCalculators(filteredCalculators)
        }
      }
    } catch (error) {
      console.error('Failed to load calculator stats:', error)
    }
  }

  const trackCalculatorClick = async (calculatorId) => {
    try {
      await fetch(`${API_BASE}/api/calculator-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ calculator_id: calculatorId })
      })
      // 클릭 후 통계 재로드
      loadCalculatorStats()
    } catch (error) {
      console.error('Failed to track calculator click:', error)
    }
  }

  const handleHamsterClick = () => {
    const messages = ['계빠르지!', '못잡계찌!']
    const nextIndex = (messageIndex + 1) % messages.length
    setSpeechText(messages[nextIndex])
    setMessageIndex(nextIndex)
    setShowSpeechBubble(true)
    
    // 클릭할 때마다 30% 빨라짐 (최소 2초까지)
    setAnimationSpeed(prev => Math.max(2, prev * 0.7))
    
    setTimeout(() => {
      setShowSpeechBubble(false)
    }, 2000)
  }

  const renderCalculator = () => {
    switch (activeTab) {
      case 'salary':
        return <SalaryCalculator />
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
      case 'market':
        return <MarketIndex />
      case 'ipo':
        return <IPOCalendar />
      default:
        return <InterestCalculator />
    }
  }

  return (
    <>
      <header className="app-header">
        <div 
          className="hamster-container"
          style={{
            animationDuration: `${animationSpeed}s`
          }}
        >
          <img 
            src="/images/profile-nobg.png" 
            alt="Profile" 
            className="header-profile" 
            onClick={handleHamsterClick}
            style={{
              animationDuration: `${animationSpeed}s`
            }}
          />
          {showSpeechBubble && (
            <div className="speech-bubble">{speechText}</div>
          )}
        </div>
        <h1>GPT보다 똑똑한 계산기, 계미나이</h1>
      </header>

      <nav className="calculator-tabs">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            className={`tab-button ${activeTab === calc.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(calc.id)
              trackCalculatorClick(calc.id)
            }}
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
