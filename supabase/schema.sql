-- ══════════════════════════════════════════════════
-- Treelogy FAQ Knowledge Base - Supabase Schema
-- ══════════════════════════════════════════════════

-- 1. Categories
CREATE TABLE IF NOT EXISTS faq_categories (
  id TEXT PRIMARY KEY,
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'HelpCircle',
  description_id TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Users (editors / admins who manage FAQ)
CREATE TABLE IF NOT EXISTS faq_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FAQ Articles
CREATE TABLE IF NOT EXISTS faq_articles (
  id SERIAL PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES faq_categories(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_id TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  updated_by UUID REFERENCES faq_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_articles_category ON faq_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_faq_articles_updated ON faq_articles(updated_at DESC);

-- 4. Action History / Audit Log
CREATE TABLE IF NOT EXISTS faq_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id INTEGER,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  user_id UUID REFERENCES faq_users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL DEFAULT 'System',
  changes JSONB DEFAULT '{}',
  article_snapshot JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_history_article ON faq_history(article_id);
CREATE INDEX IF NOT EXISTS idx_faq_history_created ON faq_history(created_at DESC);

-- 5. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER faq_articles_updated_at
  BEFORE UPDATE ON faq_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. Row Level Security (open for anon reads, require auth for writes)
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read categories" ON faq_categories FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON faq_articles FOR SELECT USING (true);
CREATE POLICY "Public read users" ON faq_users FOR SELECT USING (true);
CREATE POLICY "Public read history" ON faq_history FOR SELECT USING (true);

-- Allow anon insert/update/delete (for this internal CS tool)
CREATE POLICY "Allow all inserts on articles" ON faq_articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on articles" ON faq_articles FOR UPDATE USING (true);
CREATE POLICY "Allow all deletes on articles" ON faq_articles FOR DELETE USING (true);

CREATE POLICY "Allow all inserts on history" ON faq_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all inserts on users" ON faq_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on users" ON faq_users FOR UPDATE USING (true);

CREATE POLICY "Allow all inserts on categories" ON faq_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates on categories" ON faq_categories FOR UPDATE USING (true);

-- 7. Seed default users
INSERT INTO faq_users (name, role) VALUES
  ('Admin', 'admin'),
  ('Kemas', 'admin'),
  ('CS Team', 'editor'),
  ('Marketing', 'editor')
ON CONFLICT DO NOTHING;
