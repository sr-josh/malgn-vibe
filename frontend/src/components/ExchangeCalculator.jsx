import { useState, useEffect } from 'react'
import './Calculator.css'

function ExchangeCalculator() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('KRW')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState(null)

  // 주요 통화 목록
  const currencies = {
    KRW: { name: '대한민국 원', symbol: '₩', flag: '🇰🇷' },
    USD: { name: '미국 달러', symbol: '$', flag: '🇺🇸' },
    EUR: { name: '유로', symbol: '€', flag: '🇪🇺' },
    JPY: { name: '일본 엔', symbol: '¥', flag: '🇯🇵' },
    CNY: { name: '중국 위안', symbol: '¥', flag: '🇨🇳' },
    GBP: { name: '영국 파운드', symbol: '£', flag: '🇬🇧' },
    AUD: { name: '호주 달러', symbol: 'A$', flag: '🇦🇺' },
    CAD: { name: '캐나다 달러', symbol: 'C$', flag: '🇨🇦' },
    CHF: { name: '스위스 프랑', symbol: 'Fr', flag: '🇨🇭' },
    HKD: { name: '홍콩 달러', symbol: 'HK$', flag: '🇭🇰' },
    SGD: { name: '싱가포르 달러', symbol: 'S$', flag: '🇸🇬' },
    THB: { name: '태국 바트', symbol: '฿', flag: '🇹🇭' },
    VND: { name: '베트남 동', symbol: '₫', flag: '🇻🇳' }
  }

  // 환율 데이터 가져오기
  useEffect(() => {
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 먼저 ExchangeRate-API 시도
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        if (response.ok) {
          const data = await response.json()
          setRates(data.rates)
          setLastUpdate(new Date(data.time_last_updated * 1000))
          setLoading(false)
          return
        }
      } catch (err) {
        console.log('ExchangeRate-API 실패, 다른 API 시도 중...')
      }

      // 대체 API: Frankfurter (유럽중앙은행 기반, 더 정확함)
      const frankfurterResponse = await fetch('https://api.frankfurter.app/latest?from=USD')
      if (!frankfurterResponse.ok) {
        throw new Error('환율 정보를 가져올 수 없습니다.')
      }
      
      const frankfurterData = await frankfurterResponse.json()
      // USD를 base로 변환
      const rates = { USD: 1, ...frankfurterData.rates }
      setRates(rates)
      setLastUpdate(new Date(frankfurterData.date))
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const calculateExchange = (e) => {
    e.preventDefault()
    
    if (!amount || !rates) return
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('올바른 금액을 입력해주세요.')
      return
    }

    // USD 기준으로 환율이 제공되므로 변환
    let resultAmount
    if (fromCurrency === 'USD') {
      resultAmount = amountNum * rates[toCurrency]
    } else if (toCurrency === 'USD') {
      resultAmount = amountNum / rates[fromCurrency]
    } else {
      // 다른 통화 간 변환은 USD를 거쳐서 계산
      const usdAmount = amountNum / rates[fromCurrency]
      resultAmount = usdAmount * rates[toCurrency]
    }

    setResult({
      from: amountNum,
      to: resultAmount,
      rate: resultAmount / amountNum
    })
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    if (result) {
      setAmount(result.to.toString())
      setResult(null)
    }
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatRate = (rate) => {
    if (!rates) return '-'
    
    if (rate > 100) {
      return formatNumber(rate)
    } else {
      return new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }).format(rate)
    }
  }

  const getCurrentRate = () => {
    if (!rates) return null
    
    if (fromCurrency === 'USD') {
      return rates[toCurrency]
    } else if (toCurrency === 'USD') {
      return 1 / rates[fromCurrency]
    } else {
      return rates[toCurrency] / rates[fromCurrency]
    }
  }

  return (
    <div className="calculator">
      <div className="calculator-card">
        <h2 className="calculator-title">💱 환율 계산기</h2>
        <p className="calculator-description">실시간 환율로 주요 통화를 변환해보세요.</p>

        {loading && (
          <div className="exchange-status">
            <p>환율 정보를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="exchange-error">
            <p>⚠️ {error}</p>
            <button onClick={fetchExchangeRates} className="retry-button">
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <form onSubmit={calculateExchange} className="calculator-form">
              <div className="form-group">
                <label htmlFor="amount">금액</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="금액을 입력하세요"
                  step="any"
                  required
                />
              </div>

              <div className="form-row unit-converter-row">
                <div className="form-group">
                  <label htmlFor="fromCurrency">변환 전</label>
                  <select
                    id="fromCurrency"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="unit-select"
                  >
                    {Object.entries(currencies).map(([code, info]) => (
                      <option key={code} value={code}>
                        {info.flag} {info.name} ({code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group swap-button-container">
                  <button type="button" className="swap-button" onClick={swapCurrencies}>
                    ⇄
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="toCurrency">변환 후</label>
                  <select
                    id="toCurrency"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="unit-select"
                  >
                    {Object.entries(currencies).map(([code, info]) => (
                      <option key={code} value={code}>
                        {info.flag} {info.name} ({code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {rates && (
                <div className="current-rate">
                  <p>
                    현재 환율: 1 {fromCurrency} = {formatRate(getCurrentRate())} {toCurrency}
                  </p>
                  {lastUpdate && (
                    <p className="rate-date">
                      기준일: {lastUpdate.toLocaleDateString('ko-KR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </p>
                  )}
                </div>
              )}

              <button type="submit" className="submit-button">
                환율 변환하기
              </button>
            </form>

            {result && (
              <div className="result-container exchange-result">
                <div className="result-main">
                  <div className="result-from">
                    <span className="result-label">
                      {currencies[fromCurrency].flag} {fromCurrency}
                    </span>
                    <span className="result-value">
                      {currencies[fromCurrency].symbol}{formatNumber(result.from)}
                    </span>
                  </div>
                  <div className="result-arrow">→</div>
                  <div className="result-to">
                    <span className="result-label">
                      {currencies[toCurrency].flag} {toCurrency}
                    </span>
                    <span className="result-value highlight">
                      {currencies[toCurrency].symbol}{formatNumber(result.to)}
                    </span>
                  </div>
                </div>
                <div className="result-rate">
                  <p>환율: 1 {fromCurrency} = {formatRate(result.rate)} {toCurrency}</p>
                </div>
              </div>
            )}

            {rates && (
              <div className="exchange-rates-table">
                <div className="table-header">
                  <h3>주요 환율 (USD 기준)</h3>
                  <button onClick={fetchExchangeRates} className="refresh-button">
                    🔄 새로고침
                  </button>
                </div>
                <div className="rates-grid">
                  {Object.entries(currencies)
                    .filter(([code]) => code !== 'USD')
                    .map(([code, info]) => (
                      <div key={code} className="rate-item">
                        <span className="rate-currency">
                          {info.flag} {code}
                        </span>
                        <span className="rate-value">
                          {formatRate(rates[code])}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ExchangeCalculator
