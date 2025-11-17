// DELETE /api/ddays/[id] - 특정 D-day 삭제

export async function onRequest(context) {
  const { request, env, params } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'DELETE') {
    return new Response(
      JSON.stringify({ success: false, error: '지원하지 않는 메서드입니다' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const userId = request.headers.get('X-User-ID') || 'anonymous';
    const id = params.id;

    await env.DB.prepare(
      'DELETE FROM dday_favorites WHERE id = ? AND user_id = ?'
    ).bind(id, userId).run();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
