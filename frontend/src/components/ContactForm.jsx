import { useState } from 'react'
import './Calculator.css'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const API_BASE = ''

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || 
        !formData.subject.trim() || !formData.message.trim()) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('올바른 이메일 주소를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit request')
      }

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })

      // 3초 후 submitted 상태 리셋
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting request:', error)
      alert(error.message || '문의 제출에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    setSubmitted(false)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-card contact-form">
        <h2 className="calculator-title">✉️ 문의하기</h2>
        <p className="calculator-description">
          문의사항을 남겨주시면 확인 후 답변 드리겠습니다.
        </p>

        {submitted && (
          <div className="success-message">
            ✅ 문의가 성공적으로 접수되었습니다!
          </div>
        )}

        <form onSubmit={handleSubmit} className="calculator-form">
          <div className="form-group">
            <label htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="이름을 입력하세요"
              className="calculator-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
              className="calculator-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">제목 *</label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="문의 제목을 입력하세요"
              className="calculator-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">내용 *</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="문의 내용을 입력하세요"
              className="calculator-input contact-textarea"
              rows="8"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="calculate-btn" disabled={loading}>
              {loading ? '제출 중...' : '문의하기'}
            </button>
            <button type="button" onClick={handleReset} className="reset-btn">
              초기화
            </button>
          </div>
        </form>

        <div className="info-box">
          <p>💡 <strong>안내사항</strong></p>
          <ul>
            <li>문의 내용은 관리자만 확인할 수 있습니다</li>
            <li>답변은 입력하신 이메일로 전송됩니다</li>
            <li>영업일 기준 1-2일 내에 답변 드립니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
