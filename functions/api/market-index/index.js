// 주요 지수 조회 API
// Alpha Vantage 사용 (무료, 월 500회 제한)
// https://www.alphavantage.co/support/#api-key 에서 무료 키 발급
export async function onRequestGet(context) {
  try {
    const { env } = context
    const API_KEY = env.ALPHA_VANTAGE_KEY || 'demo' // Cloudflare 환경변수에서 가져오기
    
    const indices = {}

    // 1. 환율 (USD/KRW) - Alpha Vantage
    try {
      const fxResponse = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=KRW&apikey=${API_KEY}`
      )
      if (fxResponse.ok) {
        const fxData = await fxResponse.json()
        if (fxData['Realtime Currency Exchange Rate']) {
          const rate = fxData['Realtime Currency Exchange Rate']
          indices['KRW=X'] = {
            symbol: 'KRW=X',
            name: 'USD/KRW',
            price: parseFloat(rate['5. Exchange Rate']),
            change: null,
            changePercent: null
          }
        }
      }
    } catch (e) {
      console.error('FX fetch error:', e)
    }

    // 2. 금 시세 - metals.live (무료, 키 불필요)
    try {
      const goldResponse = await fetch('https://api.metals.live/v1/spot/gold')
      if (goldResponse.ok) {
        const goldData = await goldResponse.json()
        if (goldData && goldData.length > 0) {
          indices['GC=F'] = {
            symbol: 'GC=F',
            name: 'Gold',
            price: goldData[0].price,
            change: null,
            changePercent: null
          }
        }
      }
    } catch (e) {
      console.error('Gold fetch error:', e)
    }

    // 3. 주요 지수 - Alpha Vantage GLOBAL_QUOTE
    const symbols = [
      { key: '^GSPC', symbol: 'SPY', name: 'S&P 500' }, // S&P 500 ETF
      { key: '^IXIC', symbol: 'QQQ', name: 'NASDAQ' }, // NASDAQ ETF
      { key: '^KS11', symbol: 'EWY', name: 'KOSPI' }   // Korea ETF
    ]

    for (const item of symbols) {
      try {
        const stockResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${item.symbol}&apikey=${API_KEY}`
        )
        if (stockResponse.ok) {
          const stockData = await stockResponse.json()
          if (stockData['Global Quote']) {
            const quote = stockData['Global Quote']
            indices[item.key] = {
              symbol: item.key,
              name: item.name,
              price: parseFloat(quote['05. price']),
              change: parseFloat(quote['09. change']),
              changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
            }
          }
        }
        // API rate limit 방지 (5 calls/minute)
        await new Promise(resolve => setTimeout(resolve, 12000))
      } catch (e) {
        console.error(`Stock ${item.symbol} fetch error:`, e)
      }
    }

    // 4. 미국 국채 - Alpha Vantage 국채 ETF 사용
    try {
      // 10년물: IEF ETF
      const bond10Response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IEF&apikey=${API_KEY}`
      )
      if (bond10Response.ok) {
        const bond10Data = await bond10Response.json()
        if (bond10Data['Global Quote']) {
          const quote = bond10Data['Global Quote']
          indices['^TNX'] = {
            symbol: '^TNX',
            name: 'US 10Y',
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 12000))

      // 30년물: TLT ETF
      const bond30Response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TLT&apikey=${API_KEY}`
      )
      if (bond30Response.ok) {
        const bond30Data = await bond30Response.json()
        if (bond30Data['Global Quote']) {
          const quote = bond30Data['Global Quote']
          indices['^TYX'] = {
            symbol: '^TYX',
            name: 'US 30Y',
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
          }
        }
      }
    } catch (e) {
      console.error('Bond fetch error:', e)
    }

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
