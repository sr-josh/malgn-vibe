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

    const deductionTable = {
      10000000: { pension: 32990, health: 22870, longterm: 1680, employment: 4760, incomeTax: 0 },
      11000000: { pension: 36740, health: 25470, longterm: 1870, employment: 5300, incomeTax: 0 },
      12000000: { pension: 40500, health: 28080, longterm: 2070, employment: 5850, incomeTax: 0 },
      13000000: { pension: 44240, health: 30670, longterm: 2260, employment: 6390, incomeTax: 830 },
      14000000: { pension: 47990, health: 33270, longterm: 2450, employment: 6930, incomeTax: 2090 },
      15000000: { pension: 51750, health: 35880, longterm: 2640, employment: 7470, incomeTax: 3350 },
      16000000: { pension: 55490, health: 38470, longterm: 2830, employment: 8010, incomeTax: 4610 },
      17000000: { pension: 59240, health: 41070, longterm: 3030, employment: 8550, incomeTax: 6320 },
      18000000: { pension: 63000, health: 43680, longterm: 3220, employment: 9100, incomeTax: 8150 },
      19000000: { pension: 66740, health: 46270, longterm: 3410, employment: 9640, incomeTax: 9970 },
      20000000: { pension: 70490, health: 48870, longterm: 3600, employment: 10180, incomeTax: 11790 },
      21000000: { pension: 74250, health: 51480, longterm: 3790, employment: 10720, incomeTax: 13610 },
      22000000: { pension: 77990, health: 54070, longterm: 3990, employment: 11260, incomeTax: 15440 },
      23000000: { pension: 81740, health: 56670, longterm: 4180, employment: 11800, incomeTax: 17260 },
      24000000: { pension: 85500, health: 59280, longterm: 4370, employment: 12350, incomeTax: 19270 },
      25000000: { pension: 89240, health: 61870, longterm: 4560, employment: 12890, incomeTax: 22100 },
      26000000: { pension: 92990, health: 64470, longterm: 4750, employment: 13430, incomeTax: 24940 },
      27000000: { pension: 96750, health: 67080, longterm: 4950, employment: 13970, incomeTax: 27770 },
      28000000: { pension: 100490, health: 69670, longterm: 5140, employment: 14510, incomeTax: 30610 },
      29000000: { pension: 104240, health: 72270, longterm: 5330, employment: 15050, incomeTax: 36240 },
      30000000: { pension: 109120, health: 75650, longterm: 5580, employment: 15750, incomeTax: 68940 },
      40000000: { pension: 145490, health: 100870, longterm: 7440, employment: 21010, incomeTax: 128530 },
      50000000: { pension: 181860, health: 126080, longterm: 9300, employment: 26260, incomeTax: 196730 },
      60000000: { pension: 218240, health: 151300, longterm: 11160, employment: 31510, incomeTax: 273550 },
      70000000: { pension: 254610, health: 176520, longterm: 13020, employment: 36760, incomeTax: 358970 },
      80000000: { pension: 290980, health: 201730, longterm: 14880, employment: 42020, incomeTax: 452990 },
      90000000: { pension: 297000, health: 226950, longterm: 16740, employment: 47270, incomeTax: 555620 },
      100000000: { pension: 297000, health: 252160, longterm: 18600, employment: 52520, incomeTax: 666850 },
    }

    // 구간 찾아서 선형 보간
    let nationalPension, healthInsurance, longTermCare, employmentInsurance, incomeTax

    const tableKeys = Object.keys(deductionTable).map(Number).sort((a, b) => a - b)
    
    // 테이블에 정확히 일치하는 값이 있는지 확인
    if (deductionTable[annualAmount]) {
      const data = deductionTable[annualAmount]
      nationalPension = data.pension
      healthInsurance = data.health
      longTermCare = data.longterm
      employmentInsurance = data.employment
      incomeTax = data.incomeTax
    } else if (annualAmount < tableKeys[0]) {
      // 최소값보다 작으면 비례 계산
      const ratio = annualAmount / tableKeys[0]
      const base = deductionTable[tableKeys[0]]
      nationalPension = Math.round(base.pension * ratio)
      healthInsurance = Math.round(base.health * ratio)
      longTermCare = Math.round(base.longterm * ratio)
      employmentInsurance = Math.round(base.employment * ratio)
      incomeTax = Math.round(base.incomeTax * ratio)
    } else if (annualAmount > tableKeys[tableKeys.length - 1]) {
      // 최대값보다 크면 외삽
      const baseAnnual = tableKeys[tableKeys.length - 1]
      const prevAnnual = tableKeys[tableKeys.length - 2]
      const base = deductionTable[baseAnnual]
      const prev = deductionTable[prevAnnual]
      const diff = baseAnnual - prevAnnual
      const extraAmount = annualAmount - baseAnnual
      const extraRatio = extraAmount / diff
      
      nationalPension = Math.round(base.pension + (base.pension - prev.pension) * extraRatio)
      healthInsurance = Math.round(base.health + (base.health - prev.health) * extraRatio)
      longTermCare = Math.round(base.longterm + (base.longterm - prev.longterm) * extraRatio)
      employmentInsurance = Math.round(base.employment + (base.employment - prev.employment) * extraRatio)
      incomeTax = Math.round(base.incomeTax + (base.incomeTax - prev.incomeTax) * extraRatio)
    } else {
      // 구간 보간
      let lower = tableKeys[0]
      let upper = tableKeys[1]
      for (let i = 0; i < tableKeys.length - 1; i++) {
        if (annualAmount > tableKeys[i] && annualAmount < tableKeys[i + 1]) {
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
