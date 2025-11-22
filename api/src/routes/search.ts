import { Hono } from 'hono'

export const searchRoutes = new Hono()

// 全局搜索
searchRoutes.get('/', async (c) => {
  const { q, type, limit = '10' } = c.req.query()
  
  if (!q) {
    return c.json({ error: 'Query required' }, 400)
  }
  
  const results: any = {}
  
  // 搜索文章
  if (!type || type === 'articles') {
    const articles = await c.env.DB
      .prepare(`
        SELECT id, title, slug, description, 'article' as type
        FROM articles
        WHERE (title LIKE ? OR content LIKE ?) AND status = 'published'
        ORDER BY view_count DESC
        LIMIT ?
      `)
      .bind(`%${q}%`, `%${q}%`, limit)
      .all()
    
    results.articles = articles.results
  }
  
  // 搜索计算器
  if (!type || type === 'calculators') {
    const calculators = await c.env.DB
      .prepare(`
        SELECT id, name as title, slug, description, 'calculator' as type
        FROM calculators
        WHERE name LIKE ? OR description LIKE ?
        LIMIT ?
      `)
      .bind(`%${q}%`, `%${q}%`, limit)
      .all()
    
    results.calculators = calculators.results
  }
  
  // 搜索分类
  if (!type || type === 'categories') {
    const categories = await c.env.DB
      .prepare(`
        SELECT id, name as title, slug, description, 'category' as type
        FROM categories
        WHERE name LIKE ? OR description LIKE ?
        LIMIT ?
      `)
      .bind(`%${q}%`, `%${q}%`, limit)
      .all()
    
    results.categories = categories.results
  }
  
  return c.json({ query: q, results })
})

// 热门搜索
searchRoutes.get('/trending', async (c) => {
  // 基于浏览量的热门内容
  const articles = await c.env.DB
    .prepare(`
      SELECT id, title, slug, view_count
      FROM articles
      WHERE status = 'published'
      ORDER BY view_count DESC
      LIMIT 10
    `)
    .all()
  
  return c.json({ data: articles.results })
})

// 相关推荐
searchRoutes.get('/related/:id', async (c) => {
  const id = c.req.param('id')
  const { type = 'article' } = c.req.query()
  
  if (type === 'article') {
    // 获取文章
    const article = await c.env.DB
      .prepare('SELECT category_id FROM articles WHERE id = ?')
      .bind(id)
      .first() as any
    
    if (!article) {
      return c.json({ error: 'Not found' }, 404)
    }
    
    // 同分类的其他文章
    const related = await c.env.DB
      .prepare(`
        SELECT id, title, slug, description
        FROM articles
        WHERE category_id = ? AND id != ? AND status = 'published'
        ORDER BY view_count DESC
        LIMIT 5
      `)
      .bind(article.category_id, id)
      .all()
    
    return c.json({ data: related.results })
  }
  
  return c.json({ data: [] })
})
