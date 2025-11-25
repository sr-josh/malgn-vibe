-- 계산기 클릭 통계 테이블
CREATE TABLE IF NOT EXISTS calculator_stats (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  click_count INTEGER DEFAULT 0,
  last_clicked_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터 삽입
INSERT OR IGNORE INTO calculator_stats (id, name, icon, click_count) VALUES
  ('salary', '연봉 계산기', '💵', 0),
  ('interest', '이자 계산기', '💰', 0),
  ('dday', 'D-day 계산기', '📅', 0),
  ('unit', '미국 단위 변환', '🇺🇸', 0),
  ('exchange', '환율 계산기', '💱', 0),
  ('crypto', '암호화', '🔐', 0);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_calculator_stats_click_count ON calculator_stats(click_count DESC);
