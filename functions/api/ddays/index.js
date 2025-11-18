// D-day 즐겨찾기 API
// GET /api/ddays - 모든 즐겨찾기 가져오기
// POST /api/ddays - 새 즐겨찾기 추가

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  // CORS 헤더
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-ID',
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // D1 바인딩 확인
    if (!env.DB) {
      console.error('D1 binding not found. Please add DB binding in Cloudflare Pages settings.');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database not configured. Please contact administrator.',
          debug: 'D1 binding missing'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 사용자 ID
    const userId = request.headers.get('X-User-ID') || 'anonymous';

    // GET - 모든 D-day 가져오기
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM dday_favorites WHERE user_id = ? ORDER BY created_at DESC'
      ).bind(userId).all();

      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST - 새 D-day 추가
    if (method === 'POST') {
      const body = await request.json();
      const { name, targetDate, goalAmount } = body;

      if (!name || !targetDate) {
        return new Response(
          JSON.stringify({ success: false, error: '이름과 날짜는 필수입니다' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        'INSERT INTO dday_favorites (id, user_id, name, target_date, goal_amount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(id, userId, name, targetDate, goalAmount || null, now, now).run();

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: { id, user_id: userId, name, target_date: targetDate, goal_amount: goalAmount, created_at: now, updated_at: now }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: '지원하지 않는 메서드입니다' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        debug: {
          hasDB: !!env?.DB,
          method: method
        }
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
