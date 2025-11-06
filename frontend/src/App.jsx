import { useState } from 'react'
import './App.css'
import InterestCalculator from './components/InterestCalculator'
import DdayCalculator from './components/DdayCalculator'

function App() {
  const [activeTab, setActiveTab] = useState('interest')

  const calculators = [
    { id: 'interest', name: '이자 계산기', icon: '💰' },
    { id: 'dday', name: 'D-day 계산기', icon: '📅' },
  ]

  const renderCalculator = () => {
    switch (activeTab) {
      case 'interest':
        return <InterestCalculator />
      case 'dday':
        return <DdayCalculator />
      default:
        return <InterestCalculator />
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📅 내 손 안의 만능 계산기, 계미나이</h1>
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

      <footer className="app-footer">
        <p>Made by josh</p>
        <p>Powered by Cloudflare Pages & Workers</p>
      </footer>
    </div>
  )
}

export default App
