-- Smart Lock Hub - D1 Database Schema
-- Cloudflare D1 (SQLite)

-- =====================================================
-- 1. 用户表
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor', -- admin, editor, viewer
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME,
    is_active BOOLEAN DEFAULT 1
);

CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- 2. 分类表
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT, -- emoji or icon name
    parent_id INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- =====================================================
-- 3. 文章表
-- =====================================================
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- Markdown content
    category_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    featured BOOLEAN DEFAULT 0,
    reading_time INTEGER, -- minutes
    view_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Publishing
    status TEXT DEFAULT 'draft', -- draft, published, archived
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published ON articles(published_at);

-- =====================================================
-- 4. 文章标签表
-- =====================================================
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS article_tags (
    article_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- =====================================================
-- 5. 文章关联表（相关文章）
-- =====================================================
CREATE TABLE IF NOT EXISTS article_relations (
    article_id INTEGER NOT NULL,
    related_article_id INTEGER NOT NULL,
    PRIMARY KEY (article_id, related_article_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (related_article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- =====================================================
-- 6. 计算器表
-- =====================================================
CREATE TABLE IF NOT EXISTS calculators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    icon TEXT,
    category_id INTEGER,
    featured BOOLEAN DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Educational Content
    education_title TEXT, -- e.g., "Deep Dive"
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_calculators_slug ON calculators(slug);

-- =====================================================
-- 7. 计算器关联文章表
-- =====================================================
CREATE TABLE IF NOT EXISTS calculator_articles (
    calculator_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,
    custom_title TEXT,
    custom_description TEXT,
    display_order INTEGER DEFAULT 0,
    PRIMARY KEY (calculator_id, article_id),
    FOREIGN KEY (calculator_id) REFERENCES calculators(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- =====================================================
-- 8. 计算器关联工具表
-- =====================================================
CREATE TABLE IF NOT EXISTS calculator_relations (
    calculator_id INTEGER NOT NULL,
    related_calculator_id INTEGER NOT NULL,
    custom_name TEXT,
    custom_description TEXT,
    display_order INTEGER DEFAULT 0,
    PRIMARY KEY (calculator_id, related_calculator_id),
    FOREIGN KEY (calculator_id) REFERENCES calculators(id) ON DELETE CASCADE,
    FOREIGN KEY (related_calculator_id) REFERENCES calculators(id) ON DELETE CASCADE
);

-- =====================================================
-- 9. 页面表
-- =====================================================
CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    page_type TEXT NOT NULL, -- home, about, contact, custom
    content TEXT, -- JSON or Markdown
    
    -- Hero Section
    hero_enabled BOOLEAN DEFAULT 0,
    hero_headline TEXT,
    hero_subheadline TEXT,
    hero_image_url TEXT,
    hero_cta_text TEXT,
    hero_cta_link TEXT,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    og_image_url TEXT,
    no_index BOOLEAN DEFAULT 0,
    
    -- Publishing
    status TEXT DEFAULT 'draft',
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_type ON pages(page_type);

-- =====================================================
-- 10. 全局设置表
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT, -- JSON or plain text
    type TEXT DEFAULT 'text', -- text, json, boolean, number
    category TEXT DEFAULT 'general', -- general, seo, social, analytics
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);

-- =====================================================
-- 11. 导航菜单表
-- =====================================================
CREATE TABLE IF NOT EXISTS navigation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL, -- header, footer, sidebar
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    parent_id INTEGER,
    display_order INTEGER DEFAULT 0,
    target TEXT DEFAULT '_self', -- _self, _blank
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES navigation(id)
);

CREATE INDEX idx_navigation_location ON navigation(location);
CREATE INDEX idx_navigation_parent ON navigation(parent_id);

-- =====================================================
-- 12. 媒体文件表
-- =====================================================
CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    url TEXT NOT NULL, -- R2 URL
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL, -- bytes
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    uploaded_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE INDEX idx_media_mime ON media(mime_type);
CREATE INDEX idx_media_uploaded ON media(uploaded_by);

-- =====================================================
-- 13. 审计日志表
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL, -- create, update, delete, login
    entity_type TEXT NOT NULL, -- article, calculator, page, etc
    entity_id INTEGER,
    changes TEXT, -- JSON of changes
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- =====================================================
-- 14. 分析数据表
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    page_path TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0, -- seconds
    bounce_rate REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, page_path)
);

CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_analytics_path ON analytics(page_path);

-- =====================================================
-- 15. 插入默认数据
-- =====================================================

-- 默认管理员用户（密码: admin123，需要在应用层hash）
INSERT INTO users (email, name, role, is_active) 
VALUES ('admin@smartlock.com', 'Admin', 'admin', 1);

-- 7个Hub分类
INSERT INTO categories (name, slug, icon, description, display_order) VALUES
('Protocols', 'protocols', '📡', 'Smart lock protocols and connectivity', 1),
('Security', 'security', '🔒', 'Security analysis and best practices', 2),
('Installation', 'installation', '🔋', 'Battery and installation guides', 3),
('Troubleshooting', 'guides', '🔧', 'Troubleshooting and problem solving', 4),
('Use Cases', 'use-cases', '🏢', 'Real-world applications', 5),
('Support', 'support', '💡', 'Support and how-to guides', 6),
('Integration', 'integration', '🔗', 'System integration guides', 7);

-- 全局设置
INSERT INTO settings (key, value, category, description) VALUES
('site_title', 'Smart Lock Hub', 'seo', 'Website title'),
('site_description', 'Complete guide to smart lock selection, installation, and troubleshooting', 'seo', 'Default meta description'),
('title_template', '%s | Smart Lock Hub', 'seo', 'Title template'),
('google_analytics_id', '', 'analytics', 'Google Analytics ID'),
('maintenance_mode', 'false', 'general', 'Maintenance mode enabled');
