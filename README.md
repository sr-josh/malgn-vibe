# � Calculator Collection

Cloudflare Pages와 Workers를 활용한 계산기 모음 프로젝트입니다.

## 📁 프로젝트 구조

```
/
├─ frontend/              # React 프론트엔드
│   ├─ package.json
│   ├─ vite.config.js
│   ├─ index.html
│   ├─ src/
│   │   ├─ main.jsx
│   │   ├─ App.jsx
│   │   ├─ App.css
│   │   ├─ index.css
│   │   ├─ components/
│   │   │   ├─ SalaryCalculator.jsx     # 연봉 실수령액 계산기
│   │   │   ├─ InterestCalculator.jsx   # 예금 이자 계산기
│   │   │   ├─ DdayCalculator.jsx       # D-day 계산기
│   │   │   ├─ UnitConverter.jsx        # 미국 단위 변환기
│   │   │   ├─ ExchangeCalculator.jsx   # 환율 계산기
│   │   │   ├─ CryptoCalculator.jsx     # 텍스트 암호화
│   │   │   ├─ PostBoard.jsx            # 게시판
│   │   │   ├─ ContactForm.jsx          # 문의하기
│   │   │   └─ Calculator.css
│   │   └─ pages/
│   │       ├─ About.jsx                # 소개 페이지
│   │       ├─ Board.jsx                # 게시판 페이지
│   │       ├─ Contact.jsx              # 문의하기 페이지
│   │       ├─ Privacy.jsx              # 개인정보처리방침
│   │       ├─ Terms.jsx                # 이용약관
│   │       └─ Page.css
│   └─ dist/             # 빌드 결과물
├─ functions/             # Cloudflare Pages Functions
│   └─ api/
│       ├─ hello.js      # 기본 API 엔드포인트
│       ├─ chat.js       # 계산 API 엔드포인트
│       ├─ ddays/
│       │   ├─ index.js  # D-day 목록/생성
│       │   └─ [id].js   # D-day 삭제
│       ├─ posts/
│       │   ├─ index.js  # 게시글 목록/생성
│       │   └─ [id].js   # 게시글 조회/수정/삭제
│       └─ requests/
│           └─ index.js   # 문의 목록/생성
├─ migrations/            # D1 데이터베이스 마이그레이션
│   ├─ 001_dday.sql
│   └─ 002_posts_and_requests.sql
├─ wrangler.toml         # Cloudflare 설정 (D1 바인딩 포함)
└─ package.json          # 루트 패키지 설정
```

## 🎯 기능

### 💵 연봉 실수령액 계산기
- 2025년 기준 세율 적용
- 연봉 → 실수령액 계산
- 월급 → 필요 연봉 역산
- 국민연금, 건강보험, 장기요양, 고용보험, 소득세, 지방소득세 자동 계산
- 중소기업 청년 소득세 감면(90%) 지원
- 공제 내역 상세 표시

### 💰 예금 이자 계산기
- 단리/복리 계산 지원
- 원금, 이자율, 기간 입력
- 실시간 만기 수령액 계산
- 수익률 자동 계산
- 세금 계산 옵션

### 📅 D-day 계산기
- 목표 날짜까지 남은 일수 계산
- D-day, D+day 자동 구분
- 빠른 날짜 선택 (1주일, 1개월, 100일)
- D-day 즐겨찾기 기능 (Cloudflare D1 저장)
- 주/월 단위 변환
- 진행률 표시

### 🇺🇸 미국 단위 변환기
- 길이: 인치(in), 피트(ft), 야드(yd), 마일(mi)
- 무게: 온스(oz), 파운드(lb), 톤(ton)
- 부피: 갤런(gal), 쿼트(qt), 파인트(pt)
- 온도: 화씨(°F) ↔ 섭씨(°C)

### 💱 환율 계산기
- 실시간 환율 정보 (1회/일 업데이트)
- 다양한 통화 지원
- 양방향 변환
- 환율 목록 표시

### 🔐 텍스트 암호화
- Base64 인코딩/디코딩
- MD5 해시
- SHA-1, SHA-256, SHA-512 해시
- URL 인코딩/디코딩
- 양방향/단방향 암호화 지원

### 📋 게시판
- 게시글 작성/조회/수정/삭제 (CRUD)
- 페이지네이션 (페이지당 10개)
- 조회수 자동 증가
- 본인 작성 글만 수정/삭제 가능
- localStorage 기반 사용자 인증
- Cloudflare D1 데이터베이스 저장

### ✉️ 문의하기
- 이름, 이메일, 제목, 내용 입력
- 이메일 형식 검증
- 제출 완료 메시지 표시
- Cloudflare D1 데이터베이스 저장

## 🚀 시작하기

### 1. 의존성 설치

```bash
# 루트 디렉토리에서
npm install

# 프론트엔드 의존성 설치
cd frontend
npm install
cd ..
```

### 2. 로컬 개발

#### 프론트엔드 개발 서버 실행
```bash
cd frontend
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

#### Cloudflare Workers 로컬 테스트
```bash
# 프론트엔드 빌드
cd frontend
npm run build
cd ..

# Wrangler를 사용한 로컬 개발
npx wrangler pages dev frontend/dist
```

브라우저에서 `http://localhost:8788` 접속

## 📦 빌드

```bash
npm run build
```

빌드 결과물은 `frontend/dist/` 폴더에 생성됩니다.

## 🌐 배포

### Cloudflare Pages 배포

1. **Cloudflare 계정 로그인**
   ```bash
   npx wrangler login
   ```

2. **프로젝트 배포**
   ```bash
   npm run deploy
   ```

3. **처음 배포하는 경우**
   - Cloudflare Dashboard에서 프로젝트 생성
   - 또는 CLI를 통해 자동 생성됩니다

## 🔧 API 엔드포인트

### D-day API
- `GET /api/ddays` - D-day 목록 조회
- `POST /api/ddays` - D-day 생성
- `DELETE /api/ddays/:id` - D-day 삭제

### 게시판 API
- `GET /api/posts` - 게시글 목록 조회 (페이지네이션)
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/:id` - 게시글 상세 조회 (조회수 증가)
- `PUT /api/posts/:id` - 게시글 수정 (본인만)
- `DELETE /api/posts/:id` - 게시글 삭제 (본인만)

### 문의하기 API
- `GET /api/requests` - 문의 목록 조회
- `POST /api/requests` - 문의 제출

**예시: 게시글 작성**
```bash
curl -X POST https://your-project.pages.dev/api/posts \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user_abc123" \
  -d '{
    "title": "안녕하세요",
    "content": "첫 게시글입니다.",
    "author_name": "홍길동"
  }'
```

**예시: 문의 제출**
```bash
curl -X POST https://your-project.pages.dev/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "email": "hong@example.com",
    "subject": "문의합니다",
    "message": "서비스가 정말 좋습니다!"
  }'
```

## 🎨 계산기 추가하기

새로운 계산기를 추가하려면:

1. `frontend/src/components/` 폴더에 새 계산기 컴포넌트 생성
2. `frontend/src/App.jsx`에서 계산기 탭 추가
3. 필요시 `functions/api/chat.js`에 백엔드 로직 추가

예시:
```jsx
// 1. 컴포넌트 생성
// frontend/src/components/LoanCalculator.jsx

// 2. App.jsx에 추가
const calculators = [
  { id: 'interest', name: '💰 예금 이자 계산기', icon: '💰' },
  { id: 'dday', name: '📅 D-day 계산기', icon: '📅' },
  { id: 'loan', name: '🏦 대출 계산기', icon: '🏦' }, // 새로운 계산기
]
```

## 🗄️ 데이터베이스

### Cloudflare D1 (SQLite)

**테이블 구조:**

1. **dday_favorites** - D-day 즐겨찾기
   - id, user_id, title, target_date, description, created_at

2. **posts** - 게시판 게시글
   - id, user_id, title, content, author_name, views, created_at, updated_at

3. **requests** - 문의하기
   - id, name, email, subject, message, status, created_at

**마이그레이션 실행:**
```bash
npx wrangler d1 execute calculator-db --remote --file="migrations/001_dday.sql"
npx wrangler d1 execute calculator-db --remote --file="migrations/002_posts_and_requests.sql"
```

## 🛠 기술 스택

- **Frontend**: React 18, Vite 5
- **Backend**: Cloudflare Pages Functions
- **Database**: Cloudflare D1 (SQLite)
- **Hosting**: Cloudflare Pages
- **Styling**: Pure CSS

## 📝 주요 특징

- ✅ 서버리스 아키텍처 (Cloudflare Pages Functions)
- ✅ 전역 CDN을 통한 빠른 로딩
- ✅ Cloudflare D1 데이터베이스 통합
- ✅ 무료 호스팅 (Cloudflare Pages)
- ✅ 반응형 디자인
- ✅ 다크 모드 UI
- ✅ 부드러운 애니메이션
- ✅ 모바일 최적화
- ✅ localStorage 기반 사용자 인증
- ✅ RESTful API 설계
- ✅ 실시간 데이터 동기화

## 📄 라이선스

MIT

## 🤝 기여

이슈나 풀 리퀘스트는 언제나 환영합니다!

---

Made with ❤️ using Cloudflare Pages & Workers
