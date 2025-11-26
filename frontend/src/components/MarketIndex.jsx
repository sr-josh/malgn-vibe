import { useState, useEffect } from 'react'
import './Calculator.css'

function MarketIndex() {
  const [indices, setIndices] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)

  const API_BASE = ''

  const indexConfig = [
    { 
      symbol: '^KS11', 
      name: '코스피', 
      description: 'KOSPI',
      icon: '🇰🇷',
      category: '국내증시'
    },
    { 
      symbol: '^IXIC', 
      name: '나스닥', 
      description: 'NASDAQ',
      icon: '🇺🇸',
      category: '해외증시'
    },
    { 
      symbol: '^GSPC', 
      name: 'S&P 500', 
      description: 'S&P 500',
      icon: '🇺🇸',
      category: '해외증시'
    },
    { 
      symbol: 'GC=F', 
      name: '금 선물', 
      description: 'Gold Futures (oz)',
      icon: '🥇',
      category: '원자재',
      isGold: true
    },
    { 
      symbol: '^TNX', 
      name: '미국 10년물', 
      description: 'US 10Y Treasury',
      icon: '📊',
      category: '채권',
      isBond: true
    },
    { 
      symbol: '^TYX', 
      name: '미국 30년물', 
      description: 'US 30Y Treasury',
      icon: '📈',
      category: '채권',
      isBond: true
    }
  ]

  useEffect(() => {
    loadMarketData()
    // 5분마다 자동 새로고침
    const interval = setInterval(loadMarketData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadMarketData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE}/api/market-index`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch market data`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setIndices(data.indices || {})
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading market data:', error)
      setError(`시장 데이터를 불러오는데 실패했습니다: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num, decimals = 2) => {
    if (num === null || num === undefined) return 'N/A'
    return parseFloat(num).toLocaleString('ko-KR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  const formatPrice = (value, config) => {
    if (!value) return 'N/A'
    
    // 채권 수익률 (퍼센트)
    if (config.isBond) {
      return `${formatNumber(value, 3)}%`
    }
    
    // 금 가격 (온스당 달러)
    if (config.isGold) {
      return `$${formatNumber(value, 2)}`
    }
    
    // 주가지수
    return formatNumber(value, 2)
  }

  const formatChange = (change, changePercent) => {
    if (change === null || change === undefined) return null
    
    const isPositive = change >= 0
    const changeClass = isPositive ? 'positive' : 'negative'
    const changeSymbol = isPositive ? '+' : ''
    
    return (
      <div className={`index-change ${changeClass}`}>
        <span className="change-value">
          {changeSymbol}{formatNumber(change, 2)}
        </span>
        {changePercent !== null && changePercent !== undefined && (
          <span className="change-percent">
            ({changeSymbol}{formatNumber(changePercent, 2)}%)
          </span>
        )}
      </div>
    )
  }

  const calculateGoldKRW = (goldPriceUSD, usdkrw) => {
    if (!goldPriceUSD || !usdkrw) return null
    // 1 온스 = 31.1035 그램
    const gramPrice = (goldPriceUSD / 31.1035) * usdkrw
    return gramPrice
  }

  const groupedIndices = indexConfig.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = []
    }
    acc[config.category].push(config)
    return acc
  }, {})

  return (
    <div className="calculator-container">
      <div className="calculator-card market-index">
        <h2 className="calculator-title">📊 주요 지수</h2>
        <p className="calculator-description">
          실시간 시장 지수 및 금리 정보
        </p>

        <div className="market-header">
          <button 
            onClick={loadMarketData} 
            className="refresh-btn"
            disabled={loading}
          >
            🔄 새로고침
          </button>
          {lastUpdate && (
            <span className="last-update">
              마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}
            </span>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && !indices.length ? (
          <div className="loading">데이터를 불러오는 중...</div>
        ) : (
          <>
            {Object.entries(groupedIndices).map(([category, configs]) => (
              <div key={category} className="index-category">
                <h3 className="category-title">{category}</h3>
                <div className="index-grid">
                  {configs.map((config) => {
                    const data = indices[config.symbol]
                    return (
                      <div key={config.symbol} className="index-card">
                        <div className="index-header">
                          <span className="index-icon">{config.icon}</span>
                          <div className="index-info">
                            <div className="index-name">{config.name}</div>
                            <div className="index-description">{config.description}</div>
                          </div>
                        </div>
                        
                        {data ? (
                          <>
                            <div className="index-price">
                              {formatPrice(data.price, config)}
                            </div>
                            {formatChange(data.change, data.changePercent)}
                            
                            {config.isGold && indices['KRW=X'] && (
                              <div className="gold-krw">
                                <span className="gold-krw-label">그람당 (원화)</span>
                                <span className="gold-krw-value">
                                  ₩{formatNumber(calculateGoldKRW(data.price, indices['KRW=X'].price), 0)}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="index-na">데이터 없음</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        <div className="info-box">
          <p>💡 <strong>안내사항</strong></p>
          <ul>
            <li>데이터는 5분마다 자동으로 업데이트됩니다</li>
            <li>Yahoo Finance API를 통해 제공됩니다</li>
            <li>금 시세는 온스(oz)당 달러 가격이며, 그람당 원화 가격은 환율을 적용하여 계산됩니다</li>
            <li>채권 금리는 연 수익률(%)로 표시됩니다</li>
            <li>실제 거래 가격과 약간의 차이가 있을 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MarketIndex
