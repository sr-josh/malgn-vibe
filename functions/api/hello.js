// Cloudflare Pages Functions
// 계산 API 엔드포인트 - 백엔드 계산 처리용

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, {
    headers: corsHeaders
  });
}

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    message: "Calculator Functions API",
    version: "1.0.0",
    endpoints: ["/api/hello", "/api/chat"],
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    
    return new Response(JSON.stringify({
      message: "Request received",
      data: body,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Invalid request'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
