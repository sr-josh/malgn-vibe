// 공모주 일정 조회 API
// 한국거래소 데이터 기반 (샘플 데이터)
export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url)
    const year = parseInt(url.searchParams.get('year')) || new Date().getFullYear()
    const month = parseInt(url.searchParams.get('month')) || new Date().getMonth() + 1

    // 실제 구현시: 한국거래소 공시 크롤링 또는 증권사 API 연동
    // 현재는 샘플 데이터 제공
    const sampleIPOs = generateSampleIPOs(year, month)

    return new Response(JSON.stringify({
      year,
      month,
      ipos: sampleIPOs,
      count: sampleIPOs.length,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // 1시간 캐시
      }
    })
  } catch (error) {
    console.error('IPO API error:', error)
    return new Response(JSON.stringify({
      error: error.message,
      ipos: []
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

// 샘플 데이터 생성 (실제 구현시 DB 또는 외부 API로 교체)
function generateSampleIPOs(year, month) {
  // 현재 날짜 기준으로 이번 달과 다음 달 샘플 데이터
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // 요청한 달의 샘플 데이터만 반환
  if (year !== currentYear || (month !== currentMonth && month !== currentMonth + 1)) {
    return []
  }

  const samples = [
    // 11월 공모주 (실제 2025년 데이터 예시)
    {
      id: 1,
      company_name: 'AI솔루션',
      subscription_start: '2025-11-18',
      subscription_end: '2025-11-19',
      listing_date: '2025-11-28',
      offering_price: 25000,
      market: 'KOSDAQ',
      lead_underwriter: '한국투자증권',
      offering_shares: 5000000
    },
    {
      id: 2,
      company_name: '그린에너지',
      subscription_start: '2025-11-25',
      subscription_end: '2025-11-26',
      listing_date: '2025-12-05',
      offering_price: 18000,
      market: 'KOSDAQ',
      lead_underwriter: 'NH투자증권',
      offering_shares: 3500000
    },
    {
      id: 3,
      company_name: '바이오메드',
      subscription_start: '2025-11-27',
      subscription_end: '2025-11-28',
      listing_date: '2025-12-09',
      offering_price: 32000,
      market: 'KOSPI',
      lead_underwriter: '삼성증권',
      offering_shares: 2800000
    },
    // 12월 공모주
    {
      id: 4,
      company_name: '스마트물류',
      subscription_start: '2025-12-02',
      subscription_end: '2025-12-03',
      listing_date: '2025-12-12',
      offering_price: 22000,
      market: 'KOSDAQ',
      lead_underwriter: '미래에셋증권',
      offering_shares: 4200000
    },
    {
      id: 5,
      company_name: '클라우드테크',
      subscription_start: '2025-12-09',
      subscription_end: '2025-12-10',
      listing_date: '2025-12-19',
      offering_price: 28000,
      market: 'KOSDAQ',
      lead_underwriter: '키움증권',
      offering_shares: 3000000
    },
    {
      id: 6,
      company_name: '헬스케어플랫폼',
      subscription_start: '2025-12-16',
      subscription_end: '2025-12-17',
      listing_date: '2025-12-26',
      offering_price: 19500,
      market: 'KOSDAQ',
      lead_underwriter: 'KB증권',
      offering_shares: 3800000
    },
    {
      id: 7,
      company_name: '반도체소재',
      subscription_start: '2025-12-23',
      subscription_end: '2025-12-24',
      listing_date: '2026-01-02',
      offering_price: 35000,
      market: 'KOSPI',
      lead_underwriter: '메리츠증권',
      offering_shares: 2500000
    }
  ]

  // 요청한 달의 일정만 필터링
  return samples.filter(ipo => {
    const subStart = new Date(ipo.subscription_start)
    const subEnd = new Date(ipo.subscription_end)
    const listing = new Date(ipo.listing_date)
    
    return (
      (subStart.getFullYear() === year && subStart.getMonth() + 1 === month) ||
      (subEnd.getFullYear() === year && subEnd.getMonth() + 1 === month) ||
      (listing.getFullYear() === year && listing.getMonth() + 1 === month)
    )
  })
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
