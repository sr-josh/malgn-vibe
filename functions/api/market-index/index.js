// 주요 지수 조회 API
export async function onRequestGet(context) {
  try {
    const symbols = [
      '^KS11',    // 코스피
      '^IXIC',    // 나스닥
      '^GSPC',    // S&P 500
      'GC=F',     // 금 선물
      '^TNX',     // 미국 10년물
      '^TYX',     // 미국 30년물
      'KRW=X'     // USD/KRW 환율
    ]

    const symbolsQuery = symbols.join(',')
    
    // Yahoo Finance API 사용
    const apiUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsQuery}`
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Yahoo Finance')
    }

    const data = await response.json()
    
    if (!data.quoteResponse || !data.quoteResponse.result) {
      throw new Error('Invalid response format')
    }

    const indices = {}
    
    data.quoteResponse.result.forEach(quote => {
      indices[quote.symbol] = {
        symbol: quote.symbol,
        name: quote.shortName || quote.longName,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        previousClose: quote.regularMarketPreviousClose,
        marketTime: quote.regularMarketTime
      }
    })

    return new Response(JSON.stringify({ 
      indices,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // 5분 캐시
      }
    })
  } catch (error) {
    console.error('Market index error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      indices: {}
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*' 
      }
    })
  }
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
