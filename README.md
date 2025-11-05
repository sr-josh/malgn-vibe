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
│   │   └─ components/
│   │       ├─ InterestCalculator.jsx   # 예금 이자 계산기
│   │       ├─ DdayCalculator.jsx       # D-day 계산기
│   │       └─ Calculator.css
│   └─ dist/             # 빌드 결과물
├─ functions/             # Cloudflare Workers Functions
│   └─ api/
│       ├─ hello.js      # 기본 API 엔드포인트
│       └─ chat.js       # 계산 API 엔드포인트
├─ wrangler.toml         # Cloudflare 설정
└─ package.json          # 루트 패키지 설정
```

## 🎯 기능

### 💰 예금 이자 계산기
- 단리/복리 계산 지원
- 원금, 이자율, 기간 입력
- 실시간 만기 수령액 계산
- 수익률 자동 계산

### 📅 D-day 계산기
- 목표 날짜까지 남은 일수 계산
- D-day, D+day 자동 구분
- 빠른 날짜 선택 (1주일, 1개월, 100일)
- D-day 즐겨찾기 기능
- 주/월 단위 변환

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

### `/api/hello`
기본 API 엔드포인트

**GET 요청:**
```bash
curl https://your-project.pages.dev/api/hello
```

### `/api/chat` (계산 API)
계산기 백엔드 API

**POST 요청 - 예금 이자 계산:**
```bash
curl -X POST https://your-project.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "type": "interest",
    "data": {
      "principal": 10000000,
      "rate": 3.5,
      "period": 1,
      "compoundType": "simple"
    }
  }'
```

**POST 요청 - D-day 계산:**
```bash
curl -X POST https://your-project.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "type": "dday",
    "data": {
      "targetDate": "2025-12-31"
    }
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

## 🛠 기술 스택

- **Frontend**: React 18, Vite 5
- **Backend**: Cloudflare Workers Functions
- **Hosting**: Cloudflare Pages
- **Styling**: Pure CSS with CSS Modules

## 📝 주요 특징

- ✅ 서버리스 아키텍처
- ✅ 전역 CDN을 통한 빠른 로딩
- ✅ 무료 호스팅 (Cloudflare Pages)
- ✅ 반응형 디자인
- ✅ 다크 모드 UI
- ✅ 부드러운 애니메이션
- ✅ 모바일 최적화

## 📄 라이선스

MIT

## 🤝 기여

이슈나 풀 리퀘스트는 언제나 환영합니다!

---

Made with ❤️ using Cloudflare Pages & Workers
