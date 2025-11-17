import { useState, useEffect } from 'react'
import './Calculator.css'

function DdayCalculator() {
  const [targetDate, setTargetDate] = useState('')
  const [targetName, setTargetName] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [result, setResult] = useState(null)
  const [savedDdays, setSavedDdays] = useState([])
  const [loading, setLoading] = useState(false)

  // 사용자 ID 가져오기 또는 생성
  const getUserId = () => {
    let userId = localStorage.getItem('userId')
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('userId', userId)
    }
    return userId
  }

  // 컴포넌트 마운트 시 저장된 D-day 불러오기
  useEffect(() => {
    loadSavedDdays()
  }, [])

  // API에서 저장된 D-day 불러오기
  const loadSavedDdays = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const response = await fetch('/api/ddays', {
        headers: {
          'X-User-ID': userId
        }
      })
      const data = await response.json()
      if (data.success) {
        setSavedDdays(data.data || [])
      }
    } catch (error) {
      console.error('Failed to load D-days:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDday = (e) => {
    e.preventDefault()

    if (!targetDate) {
      alert('날짜를 선택해주세요.')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const target = new Date(targetDate)
    target.setHours(0, 0, 0, 0)

    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const isPast = diffDays < 0
    const isToday = diffDays === 0

    // 목표량 계산
    let dailyGoal = null
    if (goalAmount && !isPast && !isToday) {
      const goal = parseFloat(goalAmount)
      if (!isNaN(goal) && goal > 0) {
        dailyGoal = goal / diffDays
      }
    }

    setResult({
      name: targetName || '목표일',
      date: target.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }),
      days: Math.abs(diffDays),
      isPast,
      isToday,
      percentage: calculatePercentage(today, target),
      dailyGoal,
      totalGoal: goalAmount ? parseFloat(goalAmount) : null
    })
  }

  const calculatePercentage = (start, end) => {
    const yearStart = new Date(start.getFullYear(), 0, 1)
    const yearEnd = new Date(start.getFullYear(), 11, 31)
    const totalDays = Math.ceil((yearEnd - yearStart) / (1000 * 60 * 60 * 24))
    const passedDays = Math.ceil((start - yearStart) / (1000 * 60 * 60 * 24))
    return ((passedDays / totalDays) * 100).toFixed(1)
  }

  const saveDday = async () => {
    if (!result) return

    try {
      setLoading(true)
      const userId = getUserId()
      const response = await fetch('/api/ddays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify({
          name: result.name,
          targetDate: targetDate,
          goalAmount: goalAmount ? parseFloat(goalAmount) : null
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('D-day가 저장되었습니다!')
        await loadSavedDdays()
      } else {
        alert('저장 실패: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to save D-day:', error)
      alert('저장 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const deleteDday = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      setLoading(true)
      const userId = getUserId()
      const response = await fetch(`/api/ddays/${id}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': userId
        }
      })

      const data = await response.json()
      if (data.success) {
        await loadSavedDdays()
      } else {
        alert('삭제 실패: ' + data.error)
      }
    } catch (error) {
      console.error('Failed to delete D-day:', error)
      alert('삭제 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const loadDday = (dday) => {
    setTargetDate(dday.target_date)
    setTargetName(dday.name)
    setGoalAmount(dday.goal_amount || '')
  }

  const resetForm = () => {
    setTargetDate('')
    setTargetName('')
    setResult(null)
  }

  const getQuickDate = (days) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  const getDdayText = (result) => {
    if (result.isToday) {
      return 'D-Day'
    } else if (result.isPast) {
      return `D+${result.days}`
    } else {
      return `D-${result.days}`
    }
  }

  return (
    <div className="calculator">
      <div className="calculator-card">
        <h2 className="calculator-title">📅 D-day 계산기</h2>
        <p className="calculator-description">
          목표 날짜까지 남은 일수를 계산해보세요.
        </p>

        <form onSubmit={calculateDday} className="calculator-form">
          <div className="form-group">
            <label htmlFor="targetName">목표 이름</label>
            <input
              type="text"
              id="targetName"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="예: 수능, 결혼기념일, 여행"
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetDate">목표 날짜</label>
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="goalAmount">달성할 목표 수치 (선택)</label>
            <input
              type="number"
              id="goalAmount"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder="예: 100000 (걸음), 1000000 (원)"
              step="any"
            />
          </div>

          <div className="quick-dates">
            <span className="quick-label">빠른 선택:</span>
            <button
              type="button"
              onClick={() => setTargetDate(getQuickDate(7))}
              className="quick-btn"
            >
              1주일 후
            </button>
            <button
              type="button"
              onClick={() => setTargetDate(getQuickDate(30))}
              className="quick-btn"
            >
              1개월 후
            </button>
            <button
              type="button"
              onClick={() => setTargetDate(getQuickDate(100))}
              className="quick-btn"
            >
              100일 후
            </button>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              계산하기
            </button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              초기화
            </button>
          </div>
        </form>

        {result && (
          <div className="result-card">
            <h3 className="result-title">💡 계산 결과</h3>
            
            <div className="dday-display">
              <div className={`dday-badge ${result.isToday ? 'today' : result.isPast ? 'past' : 'future'}`}>
                {getDdayText(result)}
              </div>
              <h4 className="dday-name">{result.name}</h4>
              <p className="dday-date">{result.date}</p>
            </div>

            <div className="result-grid">
              {!result.isToday && (
                <div className="result-item highlight">
                  <span className="result-label">
                    {result.isPast ? '지난 일수' : '남은 일수'}
                  </span>
                  <span className="result-value primary">
                    {result.days}일
                  </span>
                </div>
              )}
              
              {result.isToday && (
                <div className="result-item highlight">
                  <span className="result-label">상태</span>
                  <span className="result-value today-text">오늘이 바로 그날! 🎉</span>
                </div>
              )}

              {!result.isPast && !result.isToday && (
                <>
                  <div className="result-item">
                    <span className="result-label">주 단위</span>
                    <span className="result-value">
                      약 {Math.floor(result.days / 7)}주
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">월 단위</span>
                    <span className="result-value">
                      약 {Math.floor(result.days / 30)}개월
                    </span>
                  </div>
                </>
              )}

              {result.dailyGoal && (
                <>
                  <div className="result-item highlight">
                    <span className="result-label">하루 목표량</span>
                    <span className="result-value primary">
                      {result.dailyGoal.toLocaleString('ko-KR', {
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">총 목표량</span>
                    <span className="result-value">
                      {result.totalGoal.toLocaleString('ko-KR')}
                    </span>
                  </div>
                </>
              )}
            </div>

            <button onClick={saveDday} className="btn btn-save" disabled={loading}>
              {loading ? '저장 중...' : '⭐ 즐겨찾기에 저장'}
            </button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
            로딩 중...
          </div>
        )}

        {!loading && savedDdays.length > 0 && (
          <div className="saved-ddays">
            <h3 className="saved-title">⭐ 저장된 D-day</h3>
            <div className="saved-list">
              {savedDdays.map((dday) => (
                <div key={dday.id} className="saved-item">
                  <div className="saved-info">
                    <span className="saved-name">{dday.name}</span>
                    <span className="saved-date">
                      {new Date(dday.target_date).toLocaleDateString('ko-KR')}
                    </span>
                    {dday.goal_amount && (
                      <span className="saved-date" style={{ color: '#667eea' }}>
                        목표: {parseFloat(dday.goal_amount).toLocaleString('ko-KR')}
                      </span>
                    )}
                  </div>
                  <div className="saved-actions">
                    <button
                      onClick={() => loadDday(dday)}
                      className="btn-icon"
                      title="불러오기"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => deleteDday(dday.id)}
                      className="btn-icon"
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DdayCalculator