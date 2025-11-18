# Workers 디렉토리

이 디렉토리는 Cloudflare Workers를 위한 코드가 있습니다.

## 구조

```
workers/
├── example.js          # 예제 Worker (템플릿)
├── wrangler.toml       # Worker 설정 파일
└── README.md          # 이 파일
```

## Workers vs Pages Functions

### Pages Functions (`/functions`)
- 파일 기반 자동 라우팅
- Pages 프로젝트와 함께 배포
- 간단한 API 엔드포인트에 적합
- 현재 사용: D-day API (`/functions/api/ddays/`)

### Workers (`/workers`)
- 독립적인 Worker 스크립트
- 별도 배포 필요
- 더 강력하고 유연함
- 적합한 용도:
  - Cron 작업 (scheduled triggers)
  - Queue 처리
  - 복잡한 비즈니스 로직
  - 외부 API 통합
  - 대용량 데이터 처리

## 새 Worker 추가하기

### 1. Worker 파일 생성

```javascript
// workers/my-worker.js
export default {
  async fetch(request, env, ctx) {
    return new Response('Hello from Worker!');
  }
};
```

### 2. wrangler.toml 설정

`workers/wrangler.toml` 파일에 설정 추가 또는 새 설정 파일 생성:

```toml
name = "my-worker"
main = "workers/my-worker.js"
compatibility_date = "2024-01-01"

# 바인딩, 라우팅 등 추가 설정
```

### 3. 로컬 테스트

```bash
cd workers
wrangler dev
```

### 4. 배포

```bash
cd workers
wrangler deploy
```

## 예제 사용 사례

### Cron Worker (scheduled tasks)

매일 자정에 D-day 알림 발송:

```javascript
export default {
  async scheduled(event, env, ctx) {
    // D1에서 오늘이 D-day인 항목 조회
    const { results } = await env.DB.prepare(
      'SELECT * FROM dday_favorites WHERE target_date = DATE("now")'
    ).all();
    
    // 알림 발송 로직
    for (const item of results) {
      await sendNotification(item);
    }
  }
};
```

wrangler.toml:
```toml
[triggers]
crons = ["0 0 * * *"]  # 매일 자정
```

### API Integration Worker

외부 API와 통합:

```javascript
export default {
  async fetch(request, env, ctx) {
    // 외부 API 호출
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    // D1에 저장
    await env.DB.prepare(
      'INSERT INTO cache (key, value) VALUES (?, ?)'
    ).bind('api_data', JSON.stringify(data)).run();
    
    return new Response(JSON.stringify(data));
  }
};
```

### Queue Consumer Worker

비동기 작업 처리:

```javascript
export default {
  async queue(batch, env) {
    for (const message of batch.messages) {
      // 메시지 처리
      await processMessage(message.body);
      message.ack();
    }
  }
};
```

## 명령어

```bash
# 로컬 개발 서버 실행
wrangler dev

# Worker 배포
wrangler deploy

# Logs 확인
wrangler tail

# Secret 설정
wrangler secret put SECRET_NAME

# D1 쿼리 실행
wrangler d1 execute calculator-db --command "SELECT * FROM dday_favorites LIMIT 5"
```

## 참고 문서

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [Scheduled Events](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/)
- [Queues](https://developers.cloudflare.com/queues/)
