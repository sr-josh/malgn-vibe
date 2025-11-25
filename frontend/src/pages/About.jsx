import './Page.css'

function About() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>📱 계미나이</h1>
        
        <section className="about-section">
          <h2>프로젝트 소개</h2>
          <p>"뭐가 필요한지 몰라서 다 준비해봤어"</p>
          <p>일상에서 자주 사용하는 다양한 유틸리티를 모아봤습니다.</p>
          <p>간단하고 직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.</p>
          <p>필요한 게 있으시면 언제든지 요청해 주세요!</p>
        </section>

        <section className="about-section">
          <h2>제공하는 기능</h2>
          <ul className="feature-list">
            <li>
              <strong>💵 연봉 실수령액 계산기</strong>
              <p>2025년 기준 세율로 연봉에서 실수령액을 계산하거나, 원하는 월급에서 필요한 연봉을 역산합니다. </p>
              <p>중소기업 청년 소득세 감면도 지원합니다.</p>
            </li>
            <li>
              <strong>💰 이자 계산기</strong>
              <p>예금과 적금의 이자를 계산하고, 세금까지 고려한 실수령액을 확인할 수 있습니다.</p>
            </li>
            <li>
              <strong>📅 D-day 계산기</strong>
              <p>중요한 날까지 남은 일수를 계산하고 즐겨찾기로 관리할 수 있습니다. </p>
              <p>D1 데이터베이스에 저장됩니다.</p>
            </li>
            <li>
              <strong>🇺🇸 미국 단위 변환기</strong>
              <p>미국 단위(인치, 파운드, 갤런 등)를 국제 표준 단위로 쉽게 변환할 수 있습니다.</p>
            </li>
            <li>
              <strong>💱 환율 계산기</strong>
              <p>실시간(1회/일 업데이트) 환율 및 통화간 변환 기능을 제공합니다.</p>
            </li>
            <li>
              <strong>🔐 텍스트 암호화</strong>
              <p>Base64, MD5, SHA-256 등 다양한 방식으로 텍스트를 암호화할 수 있습니다.</p>
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>기술 스택</h2>
          <div className="tech-stack">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">Cloudflare Pages</span>
            <span className="tech-badge">Cloudflare D1</span>
            <span className="tech-badge">Pages Functions</span>
          </div>
        </section>

        <section className="about-section">
          <h2>연락처</h2>
          <p>비밀</p>
        </section>
      </div>
    </div>
  )
}

export default About
