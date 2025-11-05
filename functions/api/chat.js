// Cloudflare Pages Functions
// 계산기 API 엔드포인트 (/api/calculate)

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 예금 이자 계산
function calculateInterest(principal, rate, period, compoundType = 'simple') {
  const p = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const t = parseFloat(period);

  let totalAmount, interestAmount;

  if (compoundType === 'simple') {
    // 단리: I = P * r * t
    interestAmount = p * r * t;
    totalAmount = p + interestAmount;
  } else {
    // 복리: A = P(1 + r)^t
    totalAmount = p * Math.pow(1 + r, t);
    interestAmount = totalAmount - p;
  }

  return {
    principal: p,
    interest: Math.round(interestAmount),
    total: Math.round(totalAmount),
    rate: parseFloat(rate),
    period: t,
    compoundType
  };
}

// D-day 계산
function calculateDday(targetDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    days: Math.abs(diffDays),
    isPast: diffDays < 0,
    isToday: diffDays === 0,
    targetDate: target.toISOString(),
    calculatedAt: today.toISOString()
  };
}

// OPTIONS 요청 처리 (CORS preflight)
export async function onRequestOptions() {
  return new Response(null, {
    headers: corsHeaders
  });
}

// POST 요청 처리
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'interest':
        const { principal, rate, period, compoundType } = data;
        
        if (!principal || !rate || !period) {
          throw new Error('필수 입력값이 누락되었습니다.');
        }

        result = calculateInterest(principal, rate, period, compoundType);
        break;

      case 'dday':
        const { targetDate } = data;
        
        if (!targetDate) {
          throw new Error('목표 날짜가 필요합니다.');
        }

        result = calculateDday(targetDate);
        break;

      default:
        throw new Error('지원하지 않는 계산 타입입니다.');
    }

    return new Response(JSON.stringify({
      success: true,
      result,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Error processing calculation:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// GET 요청 처리 (API 정보)
export async function onRequestGet() {
  return new Response(JSON.stringify({
    name: 'Calculator API',
    version: '1.0.0',
    endpoints: {
      interest: {
        description: '예금 이자 계산',
        method: 'POST',
        body: {
          type: 'interest',
          data: {
            principal: 'number (원금)',
            rate: 'number (연 이자율 %)',
            period: 'number (기간, 년)',
            compoundType: 'string (simple | compound)'
          }
        }
      },
      dday: {
        description: 'D-day 계산',
        method: 'POST',
        body: {
          type: 'dday',
          data: {
            targetDate: 'string (YYYY-MM-DD)'
          }
        }
      }
    },
    examples: {
      interest: {
        type: 'interest',
        data: {
          principal: 10000000,
          rate: 3.5,
          period: 1,
          compoundType: 'simple'
        }
      },
      dday: {
        type: 'dday',
        data: {
          targetDate: '2025-12-31'
        }
      }
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}
