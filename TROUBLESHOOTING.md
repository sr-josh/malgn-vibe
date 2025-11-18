# 🚨 API 405 에러 해결 가이드

## 현재 문제

1. **Failed to load D-days: SyntaxError: Unexpected token '<'**
   - API가 JSON 대신 HTML(404 페이지)을 반환하고 있음
   - Functions이 작동하지 않음

2. **405 Method Not Allowed**
   - API 엔드포인트가 제대로 설정되지 않음

## 원인

Cloudflare Pages에서 **D1 바인딩이 설정되지 않았거나**, Functions이 제대로 배포되지 않음

## ✅ 해결 방법 (반드시 따라하세요)

### 1단계: Cloudflare 대시보드에서 D1 바인딩 설정

1. https://dash.cloudflare.com/ 접속
2. **Workers & Pages** 클릭
3. **gyemini** (또는 calculator-collection) 프로젝트 선택
4. **Settings** 탭 클릭
5. 아래로 스크롤하여 **Functions** 섹션 찾기
6. **D1 database bindings** 찾기
7. **Add binding** 클릭:
   ```
   Variable name: DB
   D1 database: calculator-db
   ```
8. **Save** 클릭

⚠️ **이 단계를 건너뛰면 API가 작동하지 않습니다!**

### 2단계: Functions 경로 확인

Cloudflare Pages 대시보드에서:
1. **Functions** 탭 클릭
2. 다음 경로가 보여야 함:
   - `/api/ddays`
   - `/api/ddays/[id]`

보이지 않으면 Functions이 배포되지 않은 것입니다.

### 3단계: 재배포

```bash
# 1. 빌드
npm run build

# 2. 배포
npx wrangler pages deploy frontend/dist --project-name=gyemini

# 또는 Git push (자동 배포)
git add -A
git commit -m "Fix D1 bindings for production"
git push origin master
```

### 4단계: Functions 폴더 확인

배포 전에 확인:

```bash
# functions 폴더가 있는지 확인
ls -la functions/api/ddays/

# 다음 파일들이 있어야 함:
# - index.js (GET, POST)
# - [id].js (DELETE)
```

### 5단계: 로컬 테스트 (선택사항)

Functions을 로컬에서 테스트:

```bash
# 1. 빌드
npm run build

# 2. Pages Dev 서버 실행
npx wrangler pages dev frontend/dist --d1 DB=calculator-db

# 3. 브라우저에서 http://localhost:8788 접속
```

### 6단계: 배포 확인

배포 후 확인:

```bash
# 1. API 테스트
curl https://gyemini.pages.dev/api/ddays

# 2. 브라우저 개발자 도구에서:
# - Network 탭 확인
# - /api/ddays 요청 상태 확인
```

## 📋 체크리스트

- [ ] Cloudflare 대시보드에서 D1 바인딩 추가 (DB → calculator-db)
- [ ] wrangler.toml에 D1 설정 확인
- [ ] functions/api/ddays/index.js 파일 존재
- [ ] functions/api/ddays/[id].js 파일 존재
- [ ] 빌드 및 배포 완료
- [ ] Functions 탭에서 /api/ddays 경로 확인
- [ ] 브라우저에서 API 호출 테스트

## 🐛 여전히 작동하지 않는다면

### 확인 1: Functions 로그

Cloudflare 대시보드 → Functions → View logs

### 확인 2: D1 데이터베이스 접근

```bash
npx wrangler d1 execute calculator-db --remote --command "SELECT * FROM dday_favorites LIMIT 1"
```

### 확인 3: 캐시 삭제

1. 브라우저에서 Ctrl+Shift+Delete
2. 캐시 삭제
3. 페이지 새로고침 (Ctrl+F5)

### 확인 4: Git 연동 배포

GitHub/GitLab과 연동되어 있다면:
- Settings → Builds & deployments
- Build command: `npm run build`
- Build output directory: `frontend/dist`
- Root directory: `/`

## 📞 추가 도움

여전히 문제가 있다면:
1. Cloudflare 대시보드 → Functions 탭 스크린샷
2. 브라우저 개발자 도구 → Network 탭 스크린샷
3. Console 탭 에러 메시지

를 확인해주세요.
