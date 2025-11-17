-- D-day 즐겨찾기 테이블
CREATE TABLE IF NOT EXISTS dday_favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_date TEXT NOT NULL,
  goal_amount REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 사용자 ID와 생성일로 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_id ON dday_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON dday_favorites(created_at);
