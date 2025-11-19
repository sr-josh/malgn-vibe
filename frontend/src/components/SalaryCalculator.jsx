import { useState } from 'react'
import './Calculator.css'

function SalaryCalculator() {
  const [mode, setMode] = useState('annual') // 'annual' or 'monthly'
  const [annualSalary, setAnnualSalary] = useState('')
  const [monthlySalary, setMonthlySalary] = useState('')
  const [isSmallBusiness, setIsSmallBusiness] = useState(false)
  const [result, setResult] = useState(null)

  // 2025년 기준 세율 및 공제율 (간이세액표 기준)
  const calculateDeductions = (annualAmount, applySmallBusinessTax = false) => {
    const monthly = annualAmount / 12

    // 연봉별 정확한 공제액 테이블 (100만원 단위)
    const deductionTable = {
      10000000: { pension: 5192, health: 2749, longterm: 1906, employment: 140, incomeTax: 0 },
      20000000: { pension: 12175, health: 5874, longterm: 4073, employment: 300, incomeTax: 983 },
      30000000: { pension: 20972, health: 9000, longterm: 6240, employment: 460, incomeTax: 3611 },
      40000000: { pension: 34683, health: 12124, longterm: 8406, employment: 620, incomeTax: 10711 },
      50000000: { pension: 51196, health: 15249, longterm: 10573, employment: 780, incomeTax: 20357 },
      60000000: { pension: 68044, health: 18375, longterm: 12740, employment: 940, incomeTax: 30305 },
      70000000: { pension: 87293, health: 21498, longterm: 14906, employment: 1100, incomeTax: 42439 },
      80000000: { pension: 112738, health: 24579, longterm: 17073, employment: 1259, incomeTax: 60205 },
      90000000: { pension: 135930, health: 27750, longterm: 19240, employment: 1419, incomeTax: 76754 },
      100000000: { pension: 159119, health: 30874, longterm: 21406, employment: 1579, incomeTax: 91638 },
    }

    // 구간 찾아서 선형 보간
    let nationalPension, healthInsurance, longTermCare, employmentInsurance, incomeTax

    const annualRounded = Math.floor(annualAmount / 1000000) * 1000000
    const tableKeys = Object.keys(deductionTable).map(Number).sort((a, b) => a - b)
    
    if (annualAmount <= tableKeys[0]) {
      const ratio = annualAmount / tableKeys[0]
      const base = deductionTable[tableKeys[0]]
      nationalPension = Math.round(base.pension * ratio)
      healthInsurance = Math.round(base.health * ratio)
      longTermCare = Math.round(base.longterm * ratio)
      employmentInsurance = Math.round(base.employment * ratio)
      incomeTax = Math.round(base.incomeTax * ratio)
    } else if (annualAmount >= tableKeys[tableKeys.length - 1]) {
      const baseAnnual = tableKeys[tableKeys.length - 1]
      const base = deductionTable[baseAnnual]
      const extraRatio = (annualAmount - baseAnnual) / 10000000
      nationalPension = Math.round(base.pension + extraRatio * 20000)
      healthInsurance = Math.round(base.health + extraRatio * 3400)
      longTermCare = Math.round(base.longterm + extraRatio * 2200)
      employmentInsurance = Math.round(base.employment + extraRatio * 160)
      incomeTax = Math.round(base.incomeTax + extraRatio * 15000)
    } else {
      // 구간 보간
      let lower = tableKeys[0]
      let upper = tableKeys[1]
      for (let i = 0; i < tableKeys.length - 1; i++) {
        if (annualAmount >= tableKeys[i] && annualAmount <= tableKeys[i + 1]) {
          lower = tableKeys[i]
          upper = tableKeys[i + 1]
          break
        }
      }
      
      const ratio = (annualAmount - lower) / (upper - lower)
      const lowerData = deductionTable[lower]
      const upperData = deductionTable[upper]
      
      nationalPension = Math.round(lowerData.pension + (upperData.pension - lowerData.pension) * ratio)
      healthInsurance = Math.round(lowerData.health + (upperData.health - lowerData.health) * ratio)
      longTermCare = Math.round(lowerData.longterm + (upperData.longterm - lowerData.longterm) * ratio)
      employmentInsurance = Math.round(lowerData.employment + (upperData.employment - lowerData.employment) * ratio)
      incomeTax = Math.round(lowerData.incomeTax + (upperData.incomeTax - lowerData.incomeTax) * ratio)
    }

    // 중소기업 청년 소득세 감면 (90% 감면)
    const originalIncomeTax = incomeTax
    const originalLocalIncomeTax = Math.round(incomeTax * 0.1)
    
    if (applySmallBusinessTax) {
      incomeTax = Math.round(incomeTax * 0.1) // 90% 감면 = 10%만 납부
    }

    // 지방소득세 (소득세의 10%) - 감면 적용된 소득세 기준
    const localIncomeTax = Math.round(incomeTax * 0.1)

    const totalDeduction = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax
    const netMonthlySalary = monthly - totalDeduction

    return {
      monthly,
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localIncomeTax,
      originalIncomeTax,
      originalLocalIncomeTax,
      isSmallBusinessApplied: applySmallBusinessTax,
      totalDeduction,
      netMonthlySalary,
      netAnnualSalary: netMonthlySalary * 12
    }
  }

  const calculateFromAnnual = (e) => {
    e.preventDefault()
    const annual = parseFloat(annualSalary.replace(/,/g, ''))
    
    if (isNaN(annual) || annual <= 0) {
      alert('올바른 연봉을 입력해주세요')
      return
    }

    const deductions = calculateDeductions(annual, isSmallBusiness)
    setResult({
      type: 'annual',
      annualSalary: annual,
      ...deductions
    })
  }

  const calculateFromMonthly = (e) => {
    e.preventDefault()
    const monthly = parseFloat(monthlySalary.replace(/,/g, ''))
    
    if (isNaN(monthly) || monthly <= 0) {
      alert('올바른 월급을 입력해주세요')
      return
    }

    // 역산: 실수령액에서 연봉 추정 (반복 계산)
    let estimatedAnnual = monthly * 12
    let iterations = 0
    const maxIterations = 50

    while (iterations < maxIterations) {
      const deductions = calculateDeductions(estimatedAnnual, isSmallBusiness)
      const diff = monthly - deductions.netMonthlySalary

      if (Math.abs(diff) < 1000) {
        setResult({
          type: 'monthly',
          netMonthlySalary: monthly,
          estimatedAnnual,
          ...deductions
        })
        return
      }

      // 차이만큼 조정하여 다시 계산
      estimatedAnnual += diff * 12
      iterations++
    }

    alert('계산 오류가 발생했습니다')
  }

  const formatNumber = (num) => {
    return Math.round(num).toLocaleString('ko-KR')
  }

  const formatCurrency = (num) => {
    return `${formatNumber(num)}원`
  }

  const handleAnnualSalaryChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setAnnualSalary(formatNumber(value))
  }

  const handleMonthlySalaryChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setMonthlySalary(formatNumber(value))
  }

  const resetForm = () => {
    setAnnualSalary('')
    setMonthlySalary('')
    setIsSmallBusiness(false)
    setResult(null)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-card salary-calculator">
        <h2 className="calculator-title">💰 연봉 실수령액 계산기</h2>
        <p className="calculator-description">2025년 기준 세율 적용</p>
        
        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'annual' ? 'active' : ''}`}
            onClick={() => {
              setMode('annual')
              resetForm()
            }}
          >
            연봉 → 실수령액
          </button>
          <button
            className={`mode-btn ${mode === 'monthly' ? 'active' : ''}`}
            onClick={() => {
              setMode('monthly')
              resetForm()
            }}
          >
            월급 → 계약연봉
          </button>
        </div>

        {mode === 'annual' ? (
          <form onSubmit={calculateFromAnnual} className="calculator-form">
            <div className="form-group">
              <label htmlFor="annualSalary">연봉 (세전)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="annualSalary"
                  value={annualSalary}
                  onChange={handleAnnualSalaryChange}
                  placeholder="예: 40,000,000"
                  className="calculator-input"
                />
                <span className="input-suffix">원</span>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isSmallBusiness}
                  onChange={(e) => setIsSmallBusiness(e.target.checked)}
                />
                <span>중소기업 청년 소득세 감면 (90% 감면)</span>
              </label>
            </div>

            <div className="button-group">
              <button type="submit" className="calculate-btn">
                계산하기
              </button>
              <button type="button" onClick={resetForm} className="reset-btn">
                초기화
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={calculateFromMonthly} className="calculator-form">
            <div className="form-group">
              <label htmlFor="monthlySalary">월 실수령액 (세후)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="monthlySalary"
                  value={monthlySalary}
                  onChange={handleMonthlySalaryChange}
                  placeholder="예: 3,000,000"
                  className="calculator-input"
                />
                <span className="input-suffix">원</span>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isSmallBusiness}
                  onChange={(e) => setIsSmallBusiness(e.target.checked)}
                />
                <span>중소기업 청년 소득세 감면 (90% 감면)</span>
              </label>
            </div>

            <div className="button-group">
              <button type="submit" className="calculate-btn">
                역산하기
              </button>
              <button type="button" onClick={resetForm} className="reset-btn">
                초기화
              </button>
            </div>
          </form>
        )}

        {result && (
          <div className="result-card salary-result">
            {result.type === 'annual' ? (
              <>
                <div className="result-summary">
                  <h3>📊 연봉 분석</h3>
                  <div className="salary-main">
                    <div className="salary-item">
                      <span className="label">계약 연봉</span>
                      <span className="value gross">{formatCurrency(result.annualSalary)}</span>
                    </div>
                    <div className="salary-arrow">↓</div>
                    <div className="salary-item">
                      <span className="label">실수령 연봉</span>
                      <span className="value net">{formatCurrency(result.netAnnualSalary)}</span>
                    </div>
                  </div>
                </div>

                <div className="salary-monthly">
                  <h4>월급 상세</h4>
                  <div className="salary-row main">
                    <span>월 세전</span>
                    <span className="amount">{formatCurrency(result.monthly)}</span>
                  </div>
                  <div className="salary-row net">
                    <span>월 실수령</span>
                    <span className="amount">{formatCurrency(result.netMonthlySalary)}</span>
                  </div>
                </div>

                <div className="deductions">
                  <h4>💸 공제 내역 (월)</h4>
                  <div className="deduction-item">
                    <span>국민연금 (4.5%)</span>
                    <span>{formatCurrency(result.nationalPension)}</span>
                  </div>
                  <div className="deduction-item">
                    <span>건강보험 (3.545%)</span>
                    <span>{formatCurrency(result.healthInsurance)}</span>
                  </div>
                  <div className="deduction-item">
                    <span>장기요양 (건보의 12.81%)</span>
                    <span>{formatCurrency(result.longTermCare)}</span>
                  </div>
                  <div className="deduction-item">
                    <span>고용보험 (0.9%)</span>
                    <span>{formatCurrency(result.employmentInsurance)}</span>
                  </div>
                  <div className="deduction-item">
                    <span>소득세 {result.isSmallBusinessApplied && '(중소기업 90% 감면)'}</span>
                    <span>
                      {result.isSmallBusinessApplied && (
                        <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                          {formatCurrency(result.originalIncomeTax)}
                        </span>
                      )}
                      {formatCurrency(result.incomeTax)}
                    </span>
                  </div>
                  <div className="deduction-item">
                    <span>지방소득세 {result.isSmallBusinessApplied && '(중소기업 90% 감면)'}</span>
                    <span>
                      {result.isSmallBusinessApplied && (
                        <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                          {formatCurrency(result.originalLocalIncomeTax)}
                        </span>
                      )}
                      {formatCurrency(result.localIncomeTax)}
                    </span>
                  </div>
                  <div className="deduction-total">
                    <span>총 공제액</span>
                    <span>{formatCurrency(result.totalDeduction)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="result-summary">
                  <h3>📊 연봉 역산</h3>
                  <div className="salary-main">
                    <div className="salary-item">
                      <span className="label">월 실수령액</span>
                      <span className="value net">{formatCurrency(result.netMonthlySalary)}</span>
                    </div>
                    <div className="salary-arrow">↑</div>
                    <div className="salary-item">
                      <span className="label">필요한 계약연봉</span>
                      <span className="value gross">{formatCurrency(result.estimatedAnnual)}</span>
                    </div>
                  </div>
                </div>

                <div className="salary-monthly">
                  <h4>월급 상세</h4>
                  <div className="salary-row main">
                    <span>월 세전 (필요)</span>
                    <span className="amount">{formatCurrency(result.monthly)}</span>
                  </div>
                  <div className="salary-row net">
                    <span>월 실수령 (목표)</span>
                    <span className="amount">{formatCurrency(result.netMonthlySalary)}</span>
                  </div>
                </div>

                <div className="deductions">
                  <h4>💸 예상 공제 내역 (월)</h4>
                  <div className="deduction-item">
                    <span>국민연금 (4.5%)</span>
                    <span>{formatCurrency(result.nationalPension)}</span>
                  </div>
                  <div className="deduction-item">
                    <span>건강보험 (3.545%)</span>
                    <span>{formatCurrency(result.healthInsurance)}</span>
                  </div>
                  <div className="deduction-item">
                    <span>장기요양 (건보의 12.81%)</span>
                    <span>{formatCurrency(result.longTermCare)}</span>
                  </div>
                  <div className="deduction-item">
                    <span>고용보험 (0.9%)</span>
                    <span>{formatCurrency(result.employmentInsurance)}</span>
                  </div>
                  <div className="deduction-item">
                    <span>소득세 {result.isSmallBusinessApplied && '(중소기업 90% 감면)'}</span>
                    <span>
                      {result.isSmallBusinessApplied && (
                        <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                          {formatCurrency(result.originalIncomeTax)}
                        </span>
                      )}
                      {formatCurrency(result.incomeTax)}
                    </span>
                  </div>
                  <div className="deduction-item">
                    <span>지방소득세 {result.isSmallBusinessApplied && '(중소기업 90% 감면)'}</span>
                    <span>
                      {result.isSmallBusinessApplied && (
                        <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                          {formatCurrency(result.originalLocalIncomeTax)}
                        </span>
                      )}
                      {formatCurrency(result.localIncomeTax)}
                    </span>
                  </div>
                  <div className="deduction-total">
                    <span>총 공제액</span>
                    <span>{formatCurrency(result.totalDeduction)}</span>
                  </div>
                </div>
              </>
            )}

            <div className="info-box">
              <p>💡 <strong>참고사항</strong></p>
              <ul>
                <li>2025년 기준 세율 및 공제율 적용</li>
                <li>간이세액표 기준이며, 실제와 다를 수 있습니다</li>
                <li>부양가족, 비과세 항목 등은 미반영</li>
                <li>연말정산 시 환급/추가납부 발생 가능</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalaryCalculator
