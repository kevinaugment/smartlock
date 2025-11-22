import { Hono } from 'hono'
import { z } from 'zod'

const pageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  page_type: z.string(),
  content: z.string().optional(),
  hero_enabled: z.boolean().optional(),
  hero_headline: z.string().optional(),
  hero_subheadline: z.string().optional(),
  hero_cta_text: z.string().optional(),
  hero_cta_link: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  no_index: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
})

export const pageRoutes = new Hono()

// 获取页面列表
pageRoutes.get('/', async (c) => {
  const { status } = c.req.query()
  
  let query = 'SELECT * FROM pages WHERE 1=1'
  const params: any[] = []
  
  if (status) {
    query += ' AND status = ?'
    params.push(status)
  }
  
  query += ' ORDER BY created_at DESC'
  
  const pages = await c.env.DB.prepare(query).bind(...params).all()
  
  return c.json({ data: pages.results })
})

// 获取单个页面
pageRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  const page = await c.env.DB
    .prepare('SELECT * FROM pages WHERE id = ? OR slug = ?')
    .bind(id, id)
    .first()
  
  if (!page) {
    return c.json({ error: 'Page not found' }, 404)
  }
  
  return c.json(page)
})

// 创建页面
pageRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const data = pageSchema.parse(body)
    const payload = c.get('jwtPayload')
    
    const result = await c.env.DB
      .prepare(`
        INSERT INTO pages (
          title, slug, page_type, content,
          hero_enabled, hero_headline, hero_subheadline, hero_cta_text, hero_cta_link,
          meta_title, meta_description, meta_keywords, no_index, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        data.title, data.slug, data.page_type, data.content,
        data.hero_enabled ? 1 : 0, data.hero_headline, data.hero_subheadline,
        data.hero_cta_text, data.hero_cta_link,
        data.meta_title, data.meta_description, data.meta_keywords,
        data.no_index ? 1 : 0, data.status || 'draft'
      )
      .run()
    
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'create', 'page', result.meta.last_row_id)
      .run()
    
    return c.json({ id: result.meta.last_row_id }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create page' }, 500)
  }
})

// 更新页面
pageRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const data = pageSchema.partial().parse(body)
    const payload = c.get('jwtPayload')
    
    await c.env.DB
      .prepare(`
        UPDATE pages SET
          title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          page_type = COALESCE(?, page_type),
          content = COALESCE(?, content),
          hero_enabled = COALESCE(?, hero_enabled),
          hero_headline = COALESCE(?, hero_headline),
          hero_subheadline = COALESCE(?, hero_subheadline),
          hero_cta_text = COALESCE(?, hero_cta_text),
          hero_cta_link = COALESCE(?, hero_cta_link),
          meta_title = COALESCE(?, meta_title),
          meta_description = COALESCE(?, meta_description),
          meta_keywords = COALESCE(?, meta_keywords),
          no_index = COALESCE(?, no_index),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(
        data.title, data.slug, data.page_type, data.content,
        data.hero_enabled ? 1 : 0, data.hero_headline, data.hero_subheadline,
        data.hero_cta_text, data.hero_cta_link,
        data.meta_title, data.meta_description, data.meta_keywords,
        data.no_index ? 1 : 0, data.status, id
      )
      .run()
    
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'update', 'page', id)
      .run()
    
    return c.json({ message: 'Page updated' })
  } catch (error) {
    return c.json({ error: 'Failed to update page' }, 500)
  }
})

// 删除页面
pageRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const payload = c.get('jwtPayload')
  
  await c.env.DB.prepare('DELETE FROM pages WHERE id = ?').bind(id).run()
  
  await c.env.DB
    .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
    .bind(payload.sub, 'delete', 'page', id)
    .run()
  
  return c.json({ message: 'Page deleted' })
})
