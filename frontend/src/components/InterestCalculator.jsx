import { useState } from 'react'
import './Calculator.css'

function InterestCalculator() {
  const [depositType, setDepositType] = useState('deposit') // 'deposit' or 'savings'
  const [isDailySavings, setIsDailySavings] = useState(false) // 일납 적금 여부
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [period, setPeriod] = useState('')
  const [periodType, setPeriodType] = useState('months')
  const [compoundType, setCompoundType] = useState('simple')
  const [taxRate, setTaxRate] = useState('15.4')
  const [result, setResult] = useState(null)

  const calculateInterest = (e) => {
    e.preventDefault()

    const p = parseFloat(principal) * 10000  // 만원 단위를 원으로 변환
    const r = parseFloat(rate) / 100
    
    // 기간을 연 단위로 변환
    let t
    if (periodType === 'years') {
      t = parseFloat(period)
    } else if (periodType === 'months') {
      t = parseFloat(period) / 12
    } else {
      t = parseFloat(period) / 365
    }

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
      alert('올바른 값을 입력해주세요.')
      return
    }

    let totalAmountGross, interestAmountGross

    if (depositType === 'deposit') {
      // 예금 계산
      if (compoundType === 'simple') {
        // 단리 계산: A = P(1 + rt)
        interestAmountGross = p * r * t
        totalAmountGross = p + interestAmountGross
      } else {
        // 월복리 계산: A = P(1 + r/12)^(t*12)
        const monthlyRate = r / 12
        const months = t * 12
        totalAmountGross = p * Math.pow(1 + monthlyRate, months)
        interestAmountGross = totalAmountGross - p
      }
    } else {
      // 적금 계산
      if (isDailySavings) {
        // 일납 적금 계산 (매일 같은 금액 납입)
        const dailyDeposit = p  // 매일 납입액
        const dailyRate = r / 365
        const days = t * 365
        
        if (compoundType === 'simple') {
          // 일납 적금 단리
          interestAmountGross = 0
          for (let i = 0; i < days; i++) {
            const remainingDays = days - i
            interestAmountGross += dailyDeposit * dailyRate * remainingDays
          }
          totalAmountGross = dailyDeposit * days + interestAmountGross
        } else {
          // 일납 적금 복리
          totalAmountGross = 0
          for (let i = 0; i < days; i++) {
            const remainingDays = days - i
            totalAmountGross += dailyDeposit * Math.pow(1 + dailyRate, remainingDays)
          }
          interestAmountGross = totalAmountGross - (dailyDeposit * days)
        }
      } else {
        // 월납 적금 계산 (매월 같은 금액 납입)
        const monthlyDeposit = p  // 매월 납입액
        const monthlyRate = r / 12
        const months = t * 12
        
        if (compoundType === 'simple') {
          // 적금 단리: 매월 납입금에 대한 이자 합계
          // 첫 달 납입금: n개월 이자, 두 번째 달 납입금: n-1개월 이자...
          interestAmountGross = 0
          for (let i = 0; i < months; i++) {
            const remainingMonths = months - i
            interestAmountGross += monthlyDeposit * (r / 12) * remainingMonths
          }
          totalAmountGross = monthlyDeposit * months + interestAmountGross
        } else {
          // 적금 복리: 매월 납입금의 복리 계산
          totalAmountGross = 0
          for (let i = 0; i < months; i++) {
            const remainingMonths = months - i
            totalAmountGross += monthlyDeposit * Math.pow(1 + monthlyRate, remainingMonths)
          }
          interestAmountGross = totalAmountGross - (monthlyDeposit * months)
        }
      }
    }

    const tax = parseFloat(taxRate) / 100
    const taxAmount = interestAmountGross * tax
    const interestAmountNet = interestAmountGross - taxAmount
    
    let totalAmountNet
    if (depositType === 'deposit') {
      totalAmountNet = p + interestAmountNet
    } else if (isDailySavings) {
      totalAmountNet = (p * t * 365) + interestAmountNet
    } else {
      totalAmountNet = (p * t * 12) + interestAmountNet
    }

    setResult({
      principal: p,
      interestGross: interestAmountGross,
      taxAmount: taxAmount,
      interestNet: interestAmountNet,
      totalGross: totalAmountGross,
      totalNet: totalAmountNet,
      rate: parseFloat(rate),
      period: t,
      compoundType: compoundType === 'simple' ? '단리' : '복리',
      taxRate: parseFloat(taxRate),
      depositType: depositType === 'deposit' ? '예금' : isDailySavings ? '적금(일납)' : '적금(월납)',
      isDailySavings: isDailySavings
    })
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num))
  }

  const resetForm = () => {
    setPrincipal('')
    setRate('')
    setPeriod('')
    setPeriodType('months')
    setCompoundType('simple')
    setTaxRate('15.4')
    setDepositType('deposit')
    setIsDailySavings(false)
    setResult(null)
  }

  return (
    <div className="calculator">
      <div className="calculator-card">
        <h2 className="calculator-title">💰 이자 계산기</h2>
        <p className="calculator-description">예금 또는 적금의 이자를 계산해보세요.</p>

        <form onSubmit={calculateInterest} className="calculator-form">
          <div className="form-group">
            <label>상품 유형</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="deposit"
                  checked={depositType === 'deposit'}
                  onChange={(e) => {
                    setDepositType(e.target.value)
                    setIsDailySavings(false)
                    if (periodType === 'days') setPeriodType('months')
                  }}
                />
                <span>예금</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="savings"
                  checked={depositType === 'savings'}
                  onChange={(e) => {
                    setDepositType(e.target.value)
                  }}
                />
                <span>적금</span>
                {depositType === 'savings' && (
                  <label className="checkbox-inline">
                    <input
                      type="checkbox"
                      checked={isDailySavings}
                      onChange={(e) => {
                        setIsDailySavings(e.target.checked)
                        if (e.target.checked) {
                          setPeriodType('days')
                        } else if (periodType === 'days') {
                          setPeriodType('months')
                        }
                      }}
                    />
                    <span>일납</span>
                  </label>
                )}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="principal">
              {depositType === 'deposit' ? '원금' : isDailySavings ? '일 납입액' : '월 납입액'}
            </label>
            <div className="input-with-unit">
              <input
                type="number"
                id="principal"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="예: 1000"
                min="0"
                step="1"
                required
              />
              <span className="input-unit">만원</span>
            </div>
            <div className="amount-buttons">
              <button type="button" className="amount-btn" onClick={() => setPrincipal(prev => String(Number(prev || 0) + 1))}>+1만</button>
              <button type="button" className="amount-btn" onClick={() => setPrincipal(prev => String(Number(prev || 0) + 10))}>+10만</button>
              <button type="button" className="amount-btn" onClick={() => setPrincipal(prev => String(Number(prev || 0) + 50))}>+50만</button>
              <button type="button" className="amount-btn" onClick={() => setPrincipal(prev => String(Number(prev || 0) + 100))}>+100만</button>
              <button type="button" className="amount-btn" onClick={() => setPrincipal(prev => String(Number(prev || 0) + 500))}>+500만</button>
              <button type="button" className="amount-btn" onClick={() => setPrincipal(prev => String(Number(prev || 0) + 1000))}>+1000만</button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rate">연 이자율 (%)</label>
            <input
              type="number"
              id="rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="예: 3.5"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="period">예금 기간</label>
            <div className="input-group">
              <input
                type="number"
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="예: 12"
                min="1"
                step="1"
                required
              />
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value)}
                className="period-select"
              >
                {isDailySavings ? (
                  <>
                    <option value="days">일</option>
                    <option value="months">개월</option>
                  </>
                ) : (
                  <>
                    <option value="months">개월</option>
                    <option value="years">년</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>이자 계산 방식</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="simple"
                    checked={compoundType === 'simple'}
                    onChange={(e) => setCompoundType(e.target.value)}
                  />
                  <span>단리</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="compound"
                    checked={compoundType === 'compound'}
                    onChange={(e) => setCompoundType(e.target.value)}
                  />
                  <span>(월)복리</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tax">세금 옵션</label>
              <select
                id="tax"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="tax-select"
              >
                <option value="15.4">일반과세 (15.4%)</option>
                <option value="1.4">저율과세 (1.4%)</option>
                <option value="0">비과세 (0%)</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">계산하기</button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">초기화</button>
          </div>
        </form>

        {result && (
          <div className="result-card">
            <h3 className="result-title">💡 계산 결과</h3>
            
            {/* 입력 정보 요약 */}
            <div className="result-summary">
              <span className="summary-text">
                {result.depositType} · 
                {result.depositType === '예금' ? '원금' : result.isDailySavings ? '일 납입액' : '월 납입액'} <strong>{formatNumber(result.principal)}원</strong> · 
                이율 <strong>{result.rate}%</strong> · 
                기간 <strong>{result.period.toFixed(2)}년</strong> · 
                {result.compoundType}
              </span>
            </div>

            {/* 주요 결과: 이자 */}
            <div className="result-main">
              <div className="main-label">세후 이자</div>
              <div className="main-value">{formatNumber(result.interestNet)}원</div>
              {result.taxAmount > 0 && (
                <div className="tax-info">
                  (세전 {formatNumber(result.interestGross)}원 - 세금 {formatNumber(result.taxAmount)}원)
                </div>
              )}
            </div>

            {/* 부가 정보 */}
            <div className="result-details">
              <div className="detail-item">
                <span className="detail-label">만기 수령액</span>
                <span className="detail-value">{formatNumber(result.totalNet)}원</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">수익률</span>
                <span className="detail-value">
                  {result.depositType === '예금' 
                    ? ((result.interestNet / result.principal) * 100).toFixed(2)
                    : result.isDailySavings
                    ? ((result.interestNet / (result.principal * result.period * 365)) * 100).toFixed(2)
                    : ((result.interestNet / (result.principal * result.period * 12)) * 100).toFixed(2)
                  }%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterestCalculator