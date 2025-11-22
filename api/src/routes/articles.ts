import { Hono } from 'hono'
import { z } from 'zod'

const articleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
  category_id: z.number(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  tags: z.array(z.string()).optional(),
  related_articles: z.array(z.number()).optional(),
})

export const articleRoutes = new Hono()

// 获取文章列表（增强版：搜索、筛选、分页）
articleRoutes.get('/', async (c) => {
  const { page = '1', limit = '20', category, status, search, featured } = c.req.query()
  
  let query = `
    SELECT a.*, c.name as category_name, c.slug as category_slug, u.name as author_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN users u ON a.author_id = u.id
    WHERE 1=1
  `
  const params: any[] = []
  
  if (category) {
    query += ' AND c.slug = ?'
    params.push(category)
  }
  
  if (status) {
    query += ' AND a.status = ?'
    params.push(status)
  }
  
  if (featured) {
    query += ' AND a.featured = 1'
  }
  
  if (search) {
    query += ' AND (a.title LIKE ? OR a.content LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }
  
  query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, ((parseInt(page) - 1) * parseInt(limit)).toString())
  
  const articles = await c.env.DB.prepare(query).bind(...params).all()
  
  // 获取总数
  let countQuery = 'SELECT COUNT(*) as total FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE 1=1'
  const countParams: any[] = []
  
  if (category) {
    countQuery += ' AND c.slug = ?'
    countParams.push(category)
  }
  
  if (status) {
    countQuery += ' AND a.status = ?'
    countParams.push(status)
  }
  
  if (search) {
    countQuery += ' AND (a.title LIKE ? OR a.content LIKE ?)'
    countParams.push(`%${search}%`, `%${search}%`)
  }
  
  const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first() as any
  
  return c.json({
    data: articles.results,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: countResult.total,
      pages: Math.ceil(countResult.total / parseInt(limit)),
    }
  })
})

// 获取单篇文章（带标签和关联）
articleRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  const article = await c.env.DB
    .prepare(`
      SELECT a.*, c.name as category_name, c.slug as category_slug, u.name as author_name
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ? OR a.slug = ?
    `)
    .bind(id, id)
    .first()
  
  if (!article) {
    return c.json({ error: 'Article not found' }, 404)
  }
  
  // 获取标签
  const tags = await c.env.DB
    .prepare(`
      SELECT t.* FROM tags t
      JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ?
    `)
    .bind(article.id)
    .all()
  
  // 获取相关文章
  const related = await c.env.DB
    .prepare(`
      SELECT a.id, a.title, a.slug, a.description
      FROM articles a
      JOIN article_relations ar ON a.id = ar.related_article_id
      WHERE ar.article_id = ?
    `)
    .bind(article.id)
    .all()
  
  return c.json({
    ...article,
    tags: tags.results,
    related_articles: related.results,
  })
})

// 创建文章
articleRoutes.post('/', async (c) => {
  try {
    const payload = c.get('jwtPayload')
    const body = await c.req.json()
    const data = articleSchema.parse(body)
    
    // 计算阅读时间
    const wordsPerMinute = 200
    const wordCount = data.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    
    // 创建文章
    const result = await c.env.DB
      .prepare(`
        INSERT INTO articles (
          title, slug, description, content, category_id, author_id,
          meta_title, meta_description, meta_keywords, featured, status, reading_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        data.title,
        data.slug,
        data.description,
        data.content,
        data.category_id,
        payload.sub,
        data.meta_title,
        data.meta_description,
        data.meta_keywords,
        data.featured ? 1 : 0,
        data.status || 'draft',
        readingTime
      )
      .run()
    
    const articleId = result.meta.last_row_id
    
    // 处理标签
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        // 创建或获取标签
        let tag = await c.env.DB
          .prepare('SELECT id FROM tags WHERE name = ?')
          .bind(tagName)
          .first() as any
        
        if (!tag) {
          const tagResult = await c.env.DB
            .prepare('INSERT INTO tags (name, slug) VALUES (?, ?)')
            .bind(tagName, tagName.toLowerCase().replace(/\s+/g, '-'))
            .run()
          tag = { id: tagResult.meta.last_row_id }
        }
        
        // 关联标签
        await c.env.DB
          .prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)')
          .bind(articleId, tag.id)
          .run()
      }
    }
    
    // 处理相关文章
    if (data.related_articles && data.related_articles.length > 0) {
      for (const relatedId of data.related_articles) {
        await c.env.DB
          .prepare('INSERT INTO article_relations (article_id, related_article_id) VALUES (?, ?)')
          .bind(articleId, relatedId)
          .run()
      }
    }
    
    // 记录审计日志
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'create', 'article', articleId)
      .run()
    
    return c.json({ id: articleId, message: 'Article created successfully' }, 201)
  } catch (error: any) {
    console.error('Create article error:', error)
    return c.json({ error: error.message || 'Failed to create article' }, 500)
  }
})

// 更新文章
articleRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const payload = c.get('jwtPayload')
    const body = await c.req.json()
    const data = articleSchema.partial().parse(body)
    
    // 重新计算阅读时间
    let readingTime = undefined
    if (data.content) {
      const wordCount = data.content.split(/\s+/).length
      readingTime = Math.ceil(wordCount / 200)
    }
    
    await c.env.DB
      .prepare(`
        UPDATE articles SET
          title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          description = COALESCE(?, description),
          content = COALESCE(?, content),
          category_id = COALESCE(?, category_id),
          meta_title = COALESCE(?, meta_title),
          meta_description = COALESCE(?, meta_description),
          meta_keywords = COALESCE(?, meta_keywords),
          featured = COALESCE(?, featured),
          status = COALESCE(?, status),
          reading_time = COALESCE(?, reading_time),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(
        data.title,
        data.slug,
        data.description,
        data.content,
        data.category_id,
        data.meta_title,
        data.meta_description,
        data.meta_keywords,
        data.featured ? 1 : 0,
        data.status,
        readingTime,
        id
      )
      .run()
    
    // 更新标签
    if (data.tags) {
      // 删除现有标签关联
      await c.env.DB.prepare('DELETE FROM article_tags WHERE article_id = ?').bind(id).run()
      
      // 添加新标签
      for (const tagName of data.tags) {
        let tag = await c.env.DB
          .prepare('SELECT id FROM tags WHERE name = ?')
          .bind(tagName)
          .first() as any
        
        if (!tag) {
          const tagResult = await c.env.DB
            .prepare('INSERT INTO tags (name, slug) VALUES (?, ?)')
            .bind(tagName, tagName.toLowerCase().replace(/\s+/g, '-'))
            .run()
          tag = { id: tagResult.meta.last_row_id }
        }
        
        await c.env.DB
          .prepare('INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)')
          .bind(id, tag.id)
          .run()
      }
    }
    
    // 更新相关文章
    if (data.related_articles) {
      await c.env.DB.prepare('DELETE FROM article_relations WHERE article_id = ?').bind(id).run()
      
      for (const relatedId of data.related_articles) {
        await c.env.DB
          .prepare('INSERT INTO article_relations (article_id, related_article_id) VALUES (?, ?)')
          .bind(id, relatedId)
          .run()
      }
    }
    
    // 记录审计日志
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes) VALUES (?, ?, ?, ?, ?)')
      .bind(payload.sub, 'update', 'article', id, JSON.stringify(data))
      .run()
    
    return c.json({ message: 'Article updated successfully' })
  } catch (error: any) {
    console.error('Update article error:', error)
    return c.json({ error: error.message || 'Failed to update article' }, 500)
  }
})

// 删除文章
articleRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const payload = c.get('jwtPayload')
  
  await c.env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run()
  
  await c.env.DB
    .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
    .bind(payload.sub, 'delete', 'article', id)
    .run()
  
  return c.json({ message: 'Article deleted successfully' })
})

// 批量操作
articleRoutes.post('/batch', async (c) => {
  const { action, ids } = await c.req.json()
  const payload = c.get('jwtPayload')
  
  if (!ids || ids.length === 0) {
    return c.json({ error: 'No articles selected' }, 400)
  }
  
  if (action === 'delete') {
    const placeholders = ids.map(() => '?').join(',')
    await c.env.DB
      .prepare(`DELETE FROM articles WHERE id IN (${placeholders})`)
      .bind(...ids)
      .run()
  } else if (action === 'publish') {
    const placeholders = ids.map(() => '?').join(',')
    await c.env.DB
      .prepare(`UPDATE articles SET status = 'published', published_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`)
      .bind(...ids)
      .run()
  } else if (action === 'archive') {
    const placeholders = ids.map(() => '?').join(',')
    await c.env.DB
      .prepare(`UPDATE articles SET status = 'archived' WHERE id IN (${placeholders})`)
      .bind(...ids)
      .run()
  }
  
  await c.env.DB
    .prepare('INSERT INTO audit_logs (user_id, action, entity_type, changes) VALUES (?, ?, ?, ?)')
    .bind(payload.sub, `batch_${action}`, 'article', JSON.stringify({ ids }))
    .run()
  
  return c.json({ message: `${ids.length} articles ${action}ed` })
})

// 增加浏览次数
articleRoutes.post('/:id/view', async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB
    .prepare('UPDATE articles SET view_count = view_count + 1 WHERE id = ?')
    .bind(id)
    .run()
  
  return c.json({ message: 'View counted' })
})
