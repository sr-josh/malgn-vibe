import './Page.css'

function Privacy() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>🔒 개인정보처리방침</h1>
        
        <section className="policy-section">
          <p className="last-updated">최종 수정일: 2025년 11월 7일</p>
        </section>

        <section className="policy-section">
          <h2>1. 개인정보의 처리 목적</h2>
          <p>
            계미나이(이하 "본 사이트")는 다음의 목적을 위하여 개인정보를 처리합니다. 
            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
            이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul>
            <li>서비스 제공 및 운영</li>
            <li>서비스 개선 및 맞춤형 서비스 제공</li>
            <li>문의사항 및 불만 처리</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>2. 개인정보의 수집 및 이용</h2>
          <p>
            본 사이트는 현재 별도의 회원가입 절차가 없으며, 개인정보를 직접 수집하지 않습니다.
            다만, 서비스 이용 과정에서 다음과 같은 정보가 자동으로 생성되어 수집될 수 있습니다:
          </p>
          <ul>
            <li>방문 일시, IP 주소, 쿠키, 서비스 이용 기록</li>
            <li>기기 정보 (OS, 브라우저 종류 등)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. 개인정보의 제3자 제공</h2>
          <p>
            본 사이트는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
            다만, 아래의 경우에는 예외로 합니다:
          </p>
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. 개인정보의 처리 위탁</h2>
          <p>본 사이트는 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다:</p>
          <ul>
            <li>호스팅 서비스: Cloudflare Pages</li>
            <li>웹 분석 서비스: Google Analytics (사용 시)</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>5. 이용자의 권리</h2>
          <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul>
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정 요구</li>
            <li>개인정보 삭제 요구</li>
            <li>개인정보 처리 정지 요구</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>6. 개인정보의 파기</h2>
          <p>
            본 사이트는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
            지체없이 해당 개인정보를 파기합니다.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. 쿠키의 운용</h2>
          <p>
            본 사이트는 이용자에게 최적화된 서비스를 제공하기 위해 쿠키를 사용할 수 있습니다.
            쿠키는 웹사이트가 이용자의 브라우저에 보내는 작은 텍스트 파일로, 
            이용자의 컴퓨터 하드디스크에 저장됩니다.
          </p>
          <p>
            이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 
            웹 브라우저의 옵션을 설정함으로써 쿠키를 거부할 수 있습니다.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. 개인정보 보호책임자</h2>
          <p>
            본 사이트는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 
            개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 위하여 
            아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className="contact-box">
            <p><strong>개인정보 보호책임자</strong></p>
            <p>담당자: josh</p>
            <p>문의: 사이트 문의하기 페이지를 통해 연락 가능</p>
          </div>
        </section>

        <section className="policy-section">
          <h2>9. 개인정보처리방침의 변경</h2>
          <p>
            이 개인정보처리방침은 시행일로부터 적용되며, 
            법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
            변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>

        <section className="policy-section">
          <h2>10. 광고 게재</h2>
          <p>
            본 사이트는 Google AdSense 등의 광고 서비스를 이용할 수 있습니다. 
            광고 서비스 제공자는 이용자의 관심사에 기반한 광고를 제공하기 위해 쿠키를 사용할 수 있으며,
            이용자는 Google 광고 설정에서 맞춤 광고를 비활성화할 수 있습니다.
          </p>
          <p>
            Google의 개인정보 보호정책: 
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="policy-link">
              https://policies.google.com/privacy
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}

export default Privacy
