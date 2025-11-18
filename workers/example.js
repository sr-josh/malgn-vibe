/**
 * Example Worker
 * 
 * 이 Worker는 기본 템플릿입니다.
 * 필요에 따라 수정하거나 새로운 Worker를 추가하세요.
 * 
 * 사용 예시:
 * - Cron 작업 (scheduled triggers)
 * - 외부 API 통합
 * - 데이터 처리 및 변환
 * - 알림 발송
 */

export default {
  /**
   * HTTP 요청 처리
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS 헤더
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // OPTIONS 요청 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 라우팅
    switch (url.pathname) {
      case '/':
        return new Response(JSON.stringify({
          service: 'Calculator Worker',
          status: 'running',
          version: '1.0.0',
          endpoints: [
            '/health',
            '/example'
          ]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case '/health':
        return handleHealthCheck(env, corsHeaders);

      case '/example':
        return handleExample(request, env, corsHeaders);

      default:
        return new Response(JSON.stringify({
          error: 'Not Found',
          path: url.pathname
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  },

  /**
   * Scheduled 이벤트 처리 (Cron Triggers)
   * 
   * wrangler.toml에서 다음과 같이 설정:
   * [triggers]
   * crons = ["0 0 * * *"]  # 매일 자정
   */
  async scheduled(event, env, ctx) {
    console.log('Scheduled event triggered at:', new Date(event.scheduledTime).toISOString());
    
    // 예: 매일 실행되는 작업
    // - D-day 알림 발송
    // - 데이터 정리
    // - 통계 계산
    
    // ctx.waitUntil()을 사용하여 비동기 작업 완료 보장
    ctx.waitUntil(performScheduledTask(env));
  },

  /**
   * Queue 이벤트 처리 (Queue Consumer)
   * 
   * wrangler.toml에서 다음과 같이 설정:
   * [[queues.consumers]]
   * queue = "my-queue"
   */
  async queue(batch, env) {
    for (const message of batch.messages) {
      console.log('Processing queue message:', message.body);
      // 메시지 처리 로직
      message.ack();
    }
  }
};

/**
 * 헬스 체크 엔드포인트
 */
async function handleHealthCheck(env, corsHeaders) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    bindings: {
      DB: !!env.DB,
      KV: !!env.KV,
    }
  };

  return new Response(JSON.stringify(health), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * 예제 엔드포인트
 */
async function handleExample(request, env, corsHeaders) {
  if (request.method === 'GET') {
    return new Response(JSON.stringify({
      message: 'Example GET endpoint',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    const body = await request.json();
    return new Response(JSON.stringify({
      message: 'Example POST endpoint',
      received: body,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
}

/**
 * Scheduled 작업 실행
 */
async function performScheduledTask(env) {
  try {
    console.log('Starting scheduled task...');
    
    // 예: D1 데이터베이스 조회
    // if (env.DB) {
    //   const { results } = await env.DB.prepare(
    //     'SELECT * FROM dday_favorites WHERE target_date = DATE("now")'
    //   ).all();
    //   console.log('Found items:', results.length);
    // }

    console.log('Scheduled task completed');
  } catch (error) {
    console.error('Scheduled task failed:', error);
  }
}
