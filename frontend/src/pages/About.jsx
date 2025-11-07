import './Page.css'

function About() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>📱 계미나이</h1>
        
        <section className="about-section">
          <h2>프로젝트 소개</h2>
          <p>
            계미나이는 일상에서 자주 사용하는 다양한 계산기를 모아놓은 웹 애플리케이션입니다.
            간단하고 직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
          </p>
        </section>

        <section className="about-section">
          <h2>제공하는 기능</h2>
          <ul className="feature-list">
            <li>
              <strong>💰 이자 계산기</strong>
              <p>예금과 적금의 이자를 계산하고, 세금까지 고려한 실수령액을 확인할 수 있습니다.</p>
            </li>
            <li>
              <strong>📅 D-day 계산기</strong>
              <p>중요한 날까지 남은 일수를 계산하고 관리할 수 있습니다.</p>
            </li>
            <li>
              <strong>🇺🇸 미국 단위 변환기</strong>
              <p>미국 단위(인치, 파운드, 갤런 등)를 국제 표준 단위로 쉽게 변환할 수 있습니다.</p>
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>기술 스택</h2>
          <div className="tech-stack">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">Cloudflare Pages</span>
          </div>
        </section>

        <section className="about-section">
          <h2>연락처</h2>
          <p>문의사항이나 개선 제안이 있으시면 언제든지 연락주세요.</p>
        </section>
      </div>
    </div>
  )
}

export default About
