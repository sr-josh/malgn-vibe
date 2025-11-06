import { useState } from 'react'
import './Calculator.css'

function InterestCalculatorNew() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [period, setPeriod] = useState('')
  const [periodType, setPeriodType] = useState('months')
  const [compoundType, setCompoundType] = useState('simple')
  const [taxRate, setTaxRate] = useState('15.4')
  const [result, setResult] = useState(null)

  const calculateInterest = (e) => {
    e.preventDefault()

    const p = parseFloat(principal)
    const r = parseFloat(rate) / 100
    const t = periodType === 'years' ? parseFloat(period) : parseFloat(period) / 12

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
      alert('올바른 값을 입력해주세요.')
      return
    }

    let totalAmountGross, interestAmountGross

    if (compoundType === 'simple') {
      // 단리 계산: A = P(1 + rt)
      interestAmountGross = p * r * t
      totalAmountGross = p + interestAmountGross
    } else {
      // 복리 계산: A = P(1 + r)^t
      totalAmountGross = p * Math.pow(1 + r, t)
      interestAmountGross = totalAmountGross - p
    }

    const tax = parseFloat(taxRate) / 100
    const taxAmount = interestAmountGross * tax
    const interestAmountNet = interestAmountGross - taxAmount
    const totalAmountNet = p + interestAmountNet

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
      taxRate: parseFloat(taxRate)
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
    setResult(null)
  }

  return (
    <div className="calculator">
      <div className="calculator-card">
        <h2 className="calculator-title">💰 예금 이자 계산기</h2>
        <p className="calculator-description">예금 원금, 이자율, 기간을 입력하여 이자를 계산해보세요.</p>

        <form onSubmit={calculateInterest} className="calculator-form">
          <div className="form-group">
            <label htmlFor="principal">예금 원금 (원)</label>
            <input
              type="number"
              id="principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="예: 10000000"
              min="0"
              step="10000"
              required
            />
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
              step="0.01"
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
                <option value="months">개월</option>
                <option value="years">년</option>
              </select>
            </div>
          </div>

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
                <span>복리</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tax">세금 옵션</label>
            <select
              id="tax"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="period-select"
            >
              <option value="15.4">소득세 (15.4%)</option>
              <option value="1.4">저율과세 (1.4%)</option>
              <option value="0">비과세 (0%)</option>
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">계산하기</button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">초기화</button>
          </div>
        </form>

        {result && (
          <div className="result-card">
            <h3 className="result-title">💡 계산 결과</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">원금</span>
                <span className="result-value">{formatNumber(result.principal)}원</span>
              </div>

              <div className="result-item">
                <span className="result-label">이자 (세전, {result.compoundType})</span>
                <span className="result-value">{formatNumber(result.interestGross)}원</span>
              </div>

              <div className="result-item">
                <span className="result-label">세금 ({result.taxRate}%)</span>
                <span className="result-value">{formatNumber(result.taxAmount)}원</span>
              </div>

              <div className="result-item highlight">
                <span className="result-label">이자 (세후)</span>
                <span className="result-value primary">{formatNumber(result.interestNet)}원</span>
              </div>

              <div className="result-item highlight">
                <span className="result-label">만기 수령액 (세후)</span>
                <span className="result-value total">{formatNumber(result.totalNet)}원</span>
              </div>

              <div className="result-item">
                <span className="result-label">연 이자율</span>
                <span className="result-value">{result.rate}%</span>
              </div>

              <div className="result-item">
                <span className="result-label">예금 기간</span>
                <span className="result-value">{result.period.toFixed(2)}년</span>
              </div>

              <div className="result-item">
                <span className="result-label">수익률 (세후)</span>
                <span className="result-value">{((result.interestNet / result.principal) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

