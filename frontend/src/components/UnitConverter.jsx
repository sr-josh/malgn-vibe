import { useState } from 'react'
import './Calculator.css'

function UnitConverter() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('ft')
  const [toUnit, setToUnit] = useState('m')
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState(null)

  // 단위 변환 정의
  const units = {
    length: {
      name: '길이',
      units: {
        // 미국 단위
        in: { name: '인치 (in)', toMeter: 0.0254, common: ['mm', 'cm', 'm'] },
        ft: { name: '피트 (ft)', toMeter: 0.3048, common: ['m', 'cm'] },
        yd: { name: '야드 (yd)', toMeter: 0.9144, common: ['m'] },
        mi: { name: '마일 (mi)', toMeter: 1609.344, common: ['km', 'm'] },
        // 국제 단위
        mm: { name: '밀리미터 (mm)', toMeter: 0.001, common: ['in', 'cm'] },
        cm: { name: '센티미터 (cm)', toMeter: 0.01, common: ['in', 'ft', 'mm'] },
        m: { name: '미터 (m)', toMeter: 1, common: ['ft', 'yd', 'km'] },
        km: { name: '킬로미터 (km)', toMeter: 1000, common: ['mi', 'm'] }
      }
    },
    weight: {
      name: '무게',
      units: {
        // 미국 단위
        oz: { name: '온스 (oz)', toKg: 0.0283495, common: ['g'] },
        lb: { name: '파운드 (lb)', toKg: 0.453592, common: ['kg', 'g'] },
        ton_us: { name: '톤(미국) (ton)', toKg: 907.185, common: ['kg', 'ton'] },
        // 국제 단위
        g: { name: '그램 (g)', toKg: 0.001, common: ['oz', 'kg'] },
        kg: { name: '킬로그램 (kg)', toKg: 1, common: ['lb', 'g'] },
        ton: { name: '톤 (t)', toKg: 1000, common: ['ton_us', 'kg'] }
      }
    },
    volume: {
      name: '부피',
      units: {
        // 미국 단위
        fl_oz: { name: '액량 온스 (fl oz)', toLiter: 0.0295735, common: ['ml'] },
        cup: { name: '컵 (cup)', toLiter: 0.236588, common: ['ml', 'l'] },
        pt: { name: '파인트 (pt)', toLiter: 0.473176, common: ['ml', 'l'] },
        qt: { name: '쿼트 (qt)', toLiter: 0.946353, common: ['l', 'ml'] },
        gal: { name: '갤런 (gal)', toLiter: 3.78541, common: ['l'] },
        // 국제 단위
        ml: { name: '밀리리터 (ml)', toLiter: 0.001, common: ['fl_oz', 'cup', 'l'] },
        l: { name: '리터 (L)', toLiter: 1, common: ['gal', 'qt', 'cup'] },
        m3: { name: '세제곱미터 (m³)', toLiter: 1000, common: ['l'] }
      }
    },
    temperature: {
      name: '온도',
      units: {
        f: { name: '화씨 (°F)', common: ['c'] },
        c: { name: '섭씨 (°C)', common: ['f', 'k'] },
        k: { name: '켈빈 (K)', common: ['c'] }
      }
    },
    area: {
      name: '넓이',
      units: {
        // 미국 단위
        sq_ft: { name: '제곱피트 (sq ft)', toSqM: 0.092903, common: ['sq_m'] },
        sq_yd: { name: '제곱야드 (sq yd)', toSqM: 0.836127, common: ['sq_m'] },
        acre: { name: '에이커 (acre)', toSqM: 4046.86, common: ['ha', 'sq_m'] },
        sq_mi: { name: '제곱마일 (sq mi)', toSqM: 2589988, common: ['sq_km'] },
        // 국제 단위
        sq_m: { name: '제곱미터 (m²)', toSqM: 1, common: ['sq_ft', 'sq_yd'] },
        ha: { name: '헥타르 (ha)', toSqM: 10000, common: ['acre', 'sq_m'] },
        sq_km: { name: '제곱킬로미터 (km²)', toSqM: 1000000, common: ['sq_mi'] }
      }
    }
  }

  // 변환 가능한 단위 목록 가져오기
  const getAvailableToUnits = () => {
    const fromUnitData = units[category].units[fromUnit]
    if (!fromUnitData || !fromUnitData.common) {
      return Object.keys(units[category].units)
    }
    return fromUnitData.common
  }

  const convert = (e) => {
    e.preventDefault()

    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      alert('올바른 숫자를 입력해주세요.')
      return
    }

    let convertedValue

    if (category === 'temperature') {
      // 온도 변환 (특수 케이스)
      convertedValue = convertTemperature(value, fromUnit, toUnit)
    } else {
      // 일반 단위 변환
      const baseKey = category === 'length' ? 'toMeter' 
                    : category === 'weight' ? 'toKg'
                    : category === 'volume' ? 'toLiter'
                    : category === 'area' ? 'toSqM'
                    : null

      const baseValue = value * units[category].units[fromUnit][baseKey]
      convertedValue = baseValue / units[category].units[toUnit][baseKey]
    }

    setResult({
      input: value,
      output: convertedValue,
      fromUnit: units[category].units[fromUnit].name,
      toUnit: units[category].units[toUnit].name
    })
  }

  const convertTemperature = (value, from, to) => {
    // 먼저 섭씨로 변환
    let celsius
    if (from === 'f') {
      celsius = (value - 32) * 5 / 9
    } else if (from === 'c') {
      celsius = value
    } else {
      celsius = value - 273.15
    }

    // 목표 단위로 변환
    if (to === 'f') {
      return celsius * 9 / 5 + 32
    } else if (to === 'c') {
      return celsius
    } else {
      return celsius + 273.15
    }
  }

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    const unitKeys = Object.keys(units[newCategory].units)
    const firstUnit = unitKeys[0]
    setFromUnit(firstUnit)
    
    // 첫 번째 단위의 추천 변환 단위로 설정
    const commonUnits = units[newCategory].units[firstUnit].common
    if (commonUnits && commonUnits.length > 0) {
      setToUnit(commonUnits[0])
    } else {
      setToUnit(unitKeys[unitKeys.length - 1])
    }
    setResult(null)
  }

  const handleFromUnitChange = (newFromUnit) => {
    setFromUnit(newFromUnit)
    
    // 새로운 fromUnit의 추천 변환 단위로 toUnit 설정
    const commonUnits = units[category].units[newFromUnit].common
    if (commonUnits && commonUnits.length > 0 && !commonUnits.includes(toUnit)) {
      setToUnit(commonUnits[0])
    }
    setResult(null)
  }

  const formatNumber = (num) => {
    if (Math.abs(num) < 0.001 || Math.abs(num) > 999999) {
      return num.toExponential(6)
    }
    return new Intl.NumberFormat('ko-KR', { 
      maximumFractionDigits: 6,
      minimumFractionDigits: 0 
    }).format(num)
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    if (result) {
      setInputValue(result.output.toString())
      setResult(null)
    }
  }

  return (
    <div className="calculator">
      <div className="calculator-card">
        <h2 className="calculator-title">🇺🇸 미국 단위 변환기</h2>
        <p className="calculator-description">미국 단위를 국제 표준 단위로 변환해보세요.</p>

        <form onSubmit={convert} className="calculator-form">
          <div className="form-group">
            <label>변환 유형</label>
            <div className="category-tabs">
              {Object.entries(units).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className={`category-tab ${category === key ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(key)}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="inputValue">변환할 값</label>
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="숫자를 입력하세요"
              step="any"
              required
            />
          </div>

          <div className="form-row unit-converter-row">
            <div className="form-group">
              <label htmlFor="fromUnit">변환 전</label>
              <select
                id="fromUnit"
                value={fromUnit}
                onChange={(e) => handleFromUnitChange(e.target.value)}
                className="unit-select"
              >
                {Object.entries(units[category].units).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group swap-button-container">
              <button type="button" className="swap-button" onClick={swapUnits}>
                ⇄
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="toUnit">변환 후</label>
              <select
                id="toUnit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="unit-select"
              >
                {getAvailableToUnits().map((key) => (
                  <option key={key} value={key}>{units[category].units[key].name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">변환하기</button>
          </div>
        </form>

        {result && (
          <div className="result-card">
            <h3 className="result-title">💡 변환 결과</h3>
            
            <div className="result-summary">
              <span className="summary-text">
                <strong>{formatNumber(result.input)}</strong> {result.fromUnit}
              </span>
            </div>

            <div className="result-main">
              <div className="main-label">변환 결과</div>
              <div className="main-value">{formatNumber(result.output)}</div>
              <div className="tax-info">{result.toUnit}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnitConverter
