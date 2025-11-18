# Cloudflare Pages D1 설정 가이드

## 문제
실제 배포 환경에서 API 오류 발생:
- `/api/ddays` 엔드포인트가 404 또는 500 오류 반환
- D-day 저장/불러오기 실패

## 원인
Cloudflare Pages 대시보드에서 D1 데이터베이스 바인딩이 설정되지 않음

## 해결 방법

### 1. Cloudflare 대시보드 접속
https://dash.cloudflare.com/

### 2. Pages 프로젝트 선택
- **Workers & Pages** 메뉴 클릭
- **calculator-collection** 또는 **gyemini** 프로젝트 선택

### 3. D1 바인딩 추가
1. **Settings** 탭 클릭
2. 스크롤하여 **Functions** 섹션 찾기
3. **D1 database bindings** 찾기
4. **Add binding** 버튼 클릭
5. 다음 정보 입력:
   ```
   Variable name: DB
   D1 database: calculator-db
   ```
6. **Save** 버튼 클릭

### 4. 재배포
바인딩 설정 후 자동으로 재배포되거나, 수동으로 재배포:

```bash
npm run build
npm run deploy
```

또는 Git push로 자동 배포:
```bash
git add .
git commit -m "Update D-day calculator with D1 support"
git push
```

### 5. 확인 사항

배포 후 다음을 확인:

1. **Functions 로그 확인**
   - Cloudflare 대시보드 → 프로젝트 → Functions
   - 최근 요청 로그에서 `/api/ddays` 요청 확인

2. **D1 데이터베이스 확인**
   - Cloudflare 대시보드 → D1
   - `calculator-db` 선택
   - Console에서 쿼리 실행:
     ```sql
     SELECT * FROM dday_favorites LIMIT 10;
     ```

3. **브라우저에서 테스트**
   - https://gyemini.pages.dev 접속
   - D-day 계산기에서 즐겨찾기 저장 테스트
   - 개발자 도구(F12) → Network 탭에서 API 요청 확인

## 대체 방법 (바인딩 설정 전까지)

현재 코드는 API 실패 시 자동으로 localStorage로 폴백하므로:
- 개발 환경: localStorage 사용 (정상 작동)
- 프로덕션 환경: API 시도 → 실패 시 localStorage 사용

사용자 경험에는 문제가 없지만, 데이터가 브라우저에만 저장됩니다.

## 문제 해결

여전히 오류가 발생한다면:

1. **Functions 파일 확인**
   - `functions/api/ddays.js` 파일이 배포되었는지 확인
   - `functions/api/ddays/[id].js` 파일이 배포되었는지 확인

2. **wrangler.toml 확인**
   - D1 바인딩이 올바르게 설정되었는지 확인
   - database_id가 정확한지 확인

3. **Functions 로그 확인**
   - 에러 메시지 확인
   - `env.DB`가 undefined인지 확인

4. **다시 배포**
   ```bash
   npm run build
   wrangler pages deploy frontend/dist
   ```

## 참고 문서
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [Bindings](https://developers.cloudflare.com/pages/platform/functions/bindings/)
