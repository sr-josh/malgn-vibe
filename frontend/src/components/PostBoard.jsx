import { useState, useEffect } from 'react'
import './Calculator.css'

function PostBoard() {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState('list') // 'list', 'create', 'detail'
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', author_name: '' })
  const [loading, setLoading] = useState(false)

  const API_BASE = ''

  const getUserId = () => {
    let userId = localStorage.getItem('userId')
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('userId', userId)
    }
    return userId
  }

  useEffect(() => {
    loadPosts()
  }, [currentPage])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/api/posts?page=${currentPage}&limit=10`)
      if (!response.ok) throw new Error('Failed to load posts')
      
      const data = await response.json()
      setPosts(data.posts)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error loading posts:', error)
      alert('게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadPostDetail = async (postId) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/api/posts/${postId}`)
      if (!response.ok) throw new Error('Failed to load post')
      
      const post = await response.json()
      setSelectedPost(post)
      setViewMode('detail')
    } catch (error) {
      console.error('Error loading post:', error)
      alert('게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      const userId = getUserId()
      const url = isEditing ? `${API_BASE}/api/posts/${selectedPost.id}` : `${API_BASE}/api/posts`
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save post')

      alert(isEditing ? '게시글이 수정되었습니다.' : '게시글이 작성되었습니다.')
      setFormData({ title: '', content: '', author_name: '' })
      setViewMode('list')
      setIsEditing(false)
      setSelectedPost(null)
      setCurrentPage(1)
      loadPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('게시글 저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setFormData({
      title: selectedPost.title,
      content: selectedPost.content,
      author_name: selectedPost.author_name
    })
    setIsEditing(true)
    setViewMode('create')
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      setLoading(true)
      const userId = getUserId()
      const response = await fetch(`${API_BASE}/api/posts/${selectedPost.id}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': userId
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete post')
      }

      alert('게시글이 삭제되었습니다.')
      setViewMode('list')
      setSelectedPost(null)
      loadPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(error.message || '게시글 삭제에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-card post-board">
        <h2 className="calculator-title">📋 게시판</h2>

        {viewMode === 'list' && (
          <>
            <div className="board-header">
              <button
                className="calculate-btn"
                onClick={() => {
                  setViewMode('create')
                  setIsEditing(false)
                  setFormData({ title: '', content: '', author_name: '' })
                }}
              >
                글쓰기
              </button>
            </div>

            {loading ? (
              <div className="loading">로딩중...</div>
            ) : posts.length === 0 ? (
              <div className="no-posts">작성된 게시글이 없습니다.</div>
            ) : (
              <>
                <div className="post-list">
                  {posts.map(post => (
                    <div
                      key={post.id}
                      className="post-item"
                      onClick={() => loadPostDetail(post.id)}
                    >
                      <div className="post-title">{post.title}</div>
                      <div className="post-meta">
                        <span className="post-author">{post.author_name || '익명'}</span>
                        <span className="post-views">조회 {post.views}</span>
                        <span className="post-date">{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      이전
                    </button>
                    <span className="page-info">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {viewMode === 'create' && (
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label htmlFor="author_name">작성자</label>
              <input
                type="text"
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="익명"
                className="calculator-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">제목 *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="제목을 입력하세요"
                className="calculator-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">내용 *</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="내용을 입력하세요"
                className="calculator-input post-textarea"
                rows="10"
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="calculate-btn" disabled={loading}>
                {isEditing ? '수정하기' : '작성하기'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('list')
                  setIsEditing(false)
                  setSelectedPost(null)
                }}
                className="reset-btn"
              >
                취소
              </button>
            </div>
          </form>
        )}

        {viewMode === 'detail' && selectedPost && (
          <div className="post-detail">
            <div className="post-detail-header">
              <h3>{selectedPost.title}</h3>
              <div className="post-detail-meta">
                <span>{selectedPost.author_name || '익명'}</span>
                <span>조회 {selectedPost.views}</span>
                <span>{formatDate(selectedPost.created_at)}</span>
              </div>
            </div>

            <div className="post-detail-content">
              {selectedPost.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <div className="button-group">
              <button onClick={() => setViewMode('list')} className="calculate-btn">
                목록
              </button>
              {selectedPost.user_id === getUserId() && (
                <>
                  <button onClick={handleEdit} className="calculate-btn">
                    수정
                  </button>
                  <button onClick={handleDelete} className="reset-btn">
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostBoard
