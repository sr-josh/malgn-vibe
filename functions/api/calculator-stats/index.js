// 계산기 통계 API
export async function onRequestGet(context) {
  try {
    const { env } = context;
    
    if (!env.DB) {
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 클릭 수 기준 내림차순 정렬
    const stats = await env.DB.prepare(`
      SELECT id, name, icon, click_count, last_clicked_at
      FROM calculator_stats
      ORDER BY click_count DESC, name ASC
    `).all();

    return new Response(JSON.stringify({ calculators: stats.results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    
    if (!env.DB) {
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data = await request.json();
    const { calculator_id } = data;

    if (!calculator_id) {
      return new Response(JSON.stringify({ error: 'Calculator ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 클릭 수 증가 및 마지막 클릭 시간 업데이트
    await env.DB.prepare(`
      UPDATE calculator_stats
      SET click_count = click_count + 1,
          last_clicked_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(calculator_id).run();

    const updated = await env.DB.prepare(`
      SELECT id, name, icon, click_count, last_clicked_at
      FROM calculator_stats
      WHERE id = ?
    `).bind(calculator_id).first();

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
