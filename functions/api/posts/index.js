// 게시글 목록 조회 및 생성
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

    // 전체 게시글 수 조회
    const countResult = await env.DB.prepare('SELECT COUNT(*) as total FROM posts').first();
    const total = countResult.total;

    // 게시글 목록 조회 (최신순)
    const posts = await env.DB.prepare(`
      SELECT id, user_id, title, author_name, views, created_at, updated_at
      FROM posts
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    return new Response(JSON.stringify({
      posts: posts.results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
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

    const userId = request.headers.get('X-User-ID');
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data = await request.json();
    const { title, content, author_name } = data;

    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Title and content required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const result = await env.DB.prepare(`
      INSERT INTO posts (user_id, title, content, author_name)
      VALUES (?, ?, ?, ?)
    `).bind(userId, title, content, author_name || '익명').run();

    const post = await env.DB.prepare('SELECT * FROM posts WHERE id = ?')
      .bind(result.meta.last_row_id).first();

    return new Response(JSON.stringify(post), {
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
      'Access-Control-Allow-Headers': 'Content-Type, X-User-ID'
    }
  });
}
