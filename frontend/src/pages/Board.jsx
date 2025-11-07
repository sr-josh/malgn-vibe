import './Page.css'

function Board() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>💬 게시판</h1>
        
        <div className="board-empty">
          <p className="empty-icon">📝</p>
          <p className="empty-text">아직 게시글이 없습니다.</p>
          <p className="empty-subtext">첫 번째 게시글을 작성해보세요!</p>
        </div>

        {/* 게시판 기능은 추후 구현 예정 */}
      </div>
    </div>
  )
}

export default Board
