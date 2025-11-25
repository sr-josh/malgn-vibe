// 문의 목록 조회 및 생성
export async function onRequestGet(context) {
  try {
    const { env } = context;
    
    if (!env.DB) {
      return new Response(JSON.stringify({ error: 'Database not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const { searchParams } = new URL(context.request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const status = searchParams.get('status') || 'all';

    // 전체 문의 수 조회
    let countQuery = 'SELECT COUNT(*) as total FROM requests';
    let listQuery = 'SELECT * FROM requests';
    
    if (status !== 'all') {
      countQuery += ' WHERE status = ?';
      listQuery += ' WHERE status = ?';
    }
    
    listQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    let countResult, requests;
    if (status !== 'all') {
      countResult = await env.DB.prepare(countQuery).bind(status).first();
      requests = await env.DB.prepare(listQuery).bind(status, limit, offset).all();
    } else {
      countResult = await env.DB.prepare(countQuery).first();
      requests = await env.DB.prepare(listQuery).bind(limit, offset).all();
    }

    return new Response(JSON.stringify({
      requests: requests.results,
      pagination: {
        page,
        limit,
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit)
      }
    }), {
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
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const result = await env.DB.prepare(`
      INSERT INTO requests (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).bind(name, email, subject, message).run();

    const requestData = await env.DB.prepare('SELECT * FROM requests WHERE id = ?')
      .bind(result.meta.last_row_id).first();

    return new Response(JSON.stringify({
      message: 'Request submitted successfully',
      data: requestData
    }), {
      status: 201,
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
