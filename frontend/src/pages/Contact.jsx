import { useState } from 'react'
import './Page.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // 실제로는 백엔드 API로 전송해야 하지만, 현재는 시뮬레이션만
    console.log('문의 내용:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <h1>✉️ 문의하기</h1>
        
        <section className="contact-intro">
          <p>
            계미나이에 대한 문의사항, 개선 제안, 버그 리포트 등이 있으시면 
            아래 양식을 통해 연락 주시기 바랍니다.
          </p>
          <p>최대한 빠른 시일 내에 답변드리겠습니다.</p>
        </section>

        {submitted ? (
          <div className="contact-success">
            <div className="success-icon">✅</div>
            <h2>문의가 접수되었습니다!</h2>
            <p>빠른 시일 내에 답변드리겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">이름 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">제목 *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="문의 제목을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">문의 내용 *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="문의 내용을 상세히 입력해주세요"
                rows="8"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              문의하기
            </button>
          </form>
        )}

        <section className="contact-info">
          <h2>기타 연락 방법</h2>
          <div className="info-box">
            <p><strong>📧 이메일:</strong> 위 양식을 통해 문의해주세요</p>
            <p><strong>⏰ 답변 시간:</strong> 영업일 기준 1-3일 이내</p>
            <p><strong>💡 자주 묻는 질문:</strong> FAQ 페이지를 먼저 확인해보세요</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact
