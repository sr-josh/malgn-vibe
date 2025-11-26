import { useState, useEffect } from 'react'
import './Calculator.css'

function IPOCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [ipoData, setIpoData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)

  const API_BASE = ''

  useEffect(() => {
    loadIPOData()
  }, [currentDate])

  const loadIPOData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      
      const response = await fetch(`${API_BASE}/api/ipo?year=${year}&month=${month}`)
      if (response.ok) {
        const data = await response.json()
        setIpoData(data.ipos || [])
      } else {
        throw new Error('IPO 데이터를 불러오는데 실패했습니다')
      }
    } catch (err) {
      console.error('IPO data fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 이전 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // 달력 생성
  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // 이번 달 첫날과 마지막날
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    // 이번 달의 첫 주 시작일 (일요일부터)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    // 달력 배열 생성 (6주)
    const calendar = []
    const currentDay = new Date(startDate)
    
    for (let week = 0; week < 6; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        const dateStr = formatDateString(currentDay)
        const isCurrentMonth = currentDay.getMonth() === month
        const isToday = isSameDay(currentDay, new Date())
        
        // 해당 날짜의 IPO 정보 찾기
        const dayIPOs = ipoData.filter(ipo => {
          const subscriptionStart = ipo.subscription_start ? new Date(ipo.subscription_start) : null
          const subscriptionEnd = ipo.subscription_end ? new Date(ipo.subscription_end) : null
          const listingDate = ipo.listing_date ? new Date(ipo.listing_date) : null
          
          return (subscriptionStart && isSameDay(currentDay, subscriptionStart)) ||
                 (subscriptionEnd && isSameDay(currentDay, subscriptionEnd)) ||
                 (listingDate && isSameDay(currentDay, listingDate))
        })
        
        weekDays.push({
          date: new Date(currentDay),
          dateStr,
          day: currentDay.getDate(),
          isCurrentMonth,
          isToday,
          ipos: dayIPOs
        })
        
        currentDay.setDate(currentDay.getDate() + 1)
      }
      calendar.push(weekDays)
    }
    
    return calendar
  }

  const formatDateString = (date) => {
    return date.toISOString().split('T')[0]
  }

  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  const handleDayClick = (dayInfo) => {
    if (dayInfo.ipos.length > 0) {
      setSelectedDay(dayInfo)
    }
  }

  const getIPOEventType = (ipo, date) => {
    const subscriptionStart = ipo.subscription_start ? new Date(ipo.subscription_start) : null
    const subscriptionEnd = ipo.subscription_end ? new Date(ipo.subscription_end) : null
    const listingDate = ipo.listing_date ? new Date(ipo.listing_date) : null
    
    if (subscriptionStart && isSameDay(date, subscriptionStart)) {
      return { type: 'subscription', label: '청약시작' }
    }
    if (subscriptionEnd && isSameDay(date, subscriptionEnd)) {
      return { type: 'subscription', label: '청약마감' }
    }
    if (listingDate && isSameDay(date, listingDate)) {
      return { type: 'listing', label: '상장일' }
    }
    return null
  }

  const calendar = generateCalendar()

  return (
    <div className="calculator-container">
      <div className="calculator-card ipo-calendar">
        <h2 className="calculator-title">📅 공모주 청약 일정</h2>
        <p className="calculator-description">
          이달의 공모주 청약 및 상장 일정을 확인하세요
        </p>

        <div className="calendar-controls">
          <button onClick={goToPrevMonth} className="calendar-nav-btn">
            ◀ 이전 달
          </button>
          <button onClick={goToToday} className="calendar-today-btn">
            오늘
          </button>
          <h3 className="calendar-month">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h3>
          <button onClick={goToNextMonth} className="calendar-nav-btn">
            다음 달 ▶
          </button>
        </div>

        {loading && (
          <div className="loading-message">
            📊 공모주 일정을 불러오는 중...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="calendar-grid">
              <div className="calendar-header">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                  <div key={idx} className={`calendar-weekday ${idx === 0 ? 'sunday' : idx === 6 ? 'saturday' : ''}`}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="calendar-body">
                {calendar.map((week, weekIdx) => (
                  <div key={weekIdx} className="calendar-week">
                    {week.map((dayInfo, dayIdx) => (
                      <div
                        key={dayIdx}
                        className={`calendar-day ${!dayInfo.isCurrentMonth ? 'other-month' : ''} ${dayInfo.isToday ? 'today' : ''} ${dayInfo.ipos.length > 0 ? 'has-ipo' : ''}`}
                        onClick={() => handleDayClick(dayInfo)}
                      >
                        <div className="day-number">
                          {dayInfo.day}
                        </div>
                        {dayInfo.ipos.length > 0 && (
                          <div className="day-ipos">
                            {dayInfo.ipos.map((ipo, ipoIdx) => {
                              const eventInfo = getIPOEventType(ipo, dayInfo.date)
                              return (
                                <div 
                                  key={ipoIdx} 
                                  className={`ipo-item ${eventInfo?.type || ''}`}
                                  title={`${ipo.company_name} - ${eventInfo?.label || ''}`}
                                >
                                  <span className="ipo-company">{ipo.company_name}</span>
                                  {eventInfo && (
                                    <span className="ipo-badge">{eventInfo.label}</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {selectedDay && (
              <div className="ipo-detail-modal" onClick={() => setSelectedDay(null)}>
                <div className="ipo-detail-content" onClick={(e) => e.stopPropagation()}>
                  <h3>{selectedDay.date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                  <button className="modal-close" onClick={() => setSelectedDay(null)}>✕</button>
                  
                  <div className="ipo-list">
                    {selectedDay.ipos.map((ipo, idx) => {
                      const eventInfo = getIPOEventType(ipo, selectedDay.date)
                      return (
                        <div key={idx} className="ipo-detail-item">
                          <h4>{ipo.company_name}</h4>
                          <div className="ipo-info">
                            <span className={`ipo-badge ${eventInfo?.type || ''}`}>
                              {eventInfo?.label || '관련일정'}
                            </span>
                            {ipo.offering_price && (
                              <p><strong>공모가:</strong> {parseInt(ipo.offering_price).toLocaleString()}원</p>
                            )}
                            {ipo.subscription_start && ipo.subscription_end && (
                              <p><strong>청약기간:</strong> {new Date(ipo.subscription_start).toLocaleDateString()} ~ {new Date(ipo.subscription_end).toLocaleDateString()}</p>
                            )}
                            {ipo.listing_date && (
                              <p><strong>상장예정일:</strong> {new Date(ipo.listing_date).toLocaleDateString()}</p>
                            )}
                            {ipo.market && (
                              <p><strong>시장구분:</strong> {ipo.market}</p>
                            )}
                            {ipo.lead_underwriter && (
                              <p><strong>주관사:</strong> {ipo.lead_underwriter}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="info-box">
              <p>💡 <strong>안내사항</strong></p>
              <ul>
                <li>청약시작/마감일과 상장일이 달력에 표시됩니다</li>
                <li>날짜를 클릭하면 해당 공모주의 상세 정보를 확인할 수 있습니다</li>
                <li>청약 일정은 변경될 수 있으니 증권사를 통해 확인하세요</li>
                <li>데이터는 한국거래소 공시를 기준으로 제공됩니다</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default IPOCalendar
