import { Hono } from 'hono'
import { z } from 'zod'

const calculatorSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  url: z.string().min(1),
  icon: z.string().optional(),
  category_id: z.number().optional(),
  featured: z.boolean().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  education_title: z.string().optional(),
})

export const calculatorRoutes = new Hono()

// 获取计算器列表
calculatorRoutes.get('/', async (c) => {
  const { page = '1', limit = '20', featured } = c.req.query()
  
  let query = `
    SELECT c.*, cat.name as category_name
    FROM calculators c
    LEFT JOIN categories cat ON c.category_id = cat.id
    WHERE 1=1
  `
  const params: any[] = []
  
  if (featured) {
    query += ' AND c.featured = 1'
  }
  
  query += ' ORDER BY c.display_order ASC, c.name ASC LIMIT ? OFFSET ?'
  params.push(limit, ((parseInt(page) - 1) * parseInt(limit)).toString())
  
  const calculators = await c.env.DB.prepare(query).bind(...params).all()
  
  return c.json({ data: calculators.results })
})

// 获取单个计算器
calculatorRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  
  const calculator = await c.env.DB
    .prepare('SELECT c.*, cat.name as category_name FROM calculators c LEFT JOIN categories cat ON c.category_id = cat.id WHERE c.id = ? OR c.slug = ?')
    .bind(id, id)
    .first()
  
  if (!calculator) {
    return c.json({ error: 'Calculator not found' }, 404)
  }
  
  // 获取关联的文章
  const articles = await c.env.DB
    .prepare(`
      SELECT a.id, a.title, a.slug, a.description, ca.custom_title, ca.custom_description
      FROM calculator_articles ca
      JOIN articles a ON ca.article_id = a.id
      WHERE ca.calculator_id = ?
      ORDER BY ca.display_order ASC
    `)
    .bind(calculator.id)
    .all()
  
  // 获取关联的工具
  const relatedTools = await c.env.DB
    .prepare(`
      SELECT c.id, c.name, c.slug, c.description, cr.custom_name, cr.custom_description
      FROM calculator_relations cr
      JOIN calculators c ON cr.related_calculator_id = c.id
      WHERE cr.calculator_id = ?
      ORDER BY cr.display_order ASC
    `)
    .bind(calculator.id)
    .all()
  
  return c.json({
    ...calculator,
    articles: articles.results,
    related_tools: relatedTools.results,
  })
})

// 创建计算器
calculatorRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const data = calculatorSchema.parse(body)
    const payload = c.get('jwtPayload')
    
    const result = await c.env.DB
      .prepare(`
        INSERT INTO calculators (
          name, slug, description, url, icon, category_id, featured,
          meta_title, meta_description, education_title
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        data.name, data.slug, data.description, data.url, data.icon,
        data.category_id, data.featured ? 1 : 0,
        data.meta_title, data.meta_description, data.education_title
      )
      .run()
    
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'create', 'calculator', result.meta.last_row_id)
      .run()
    
    return c.json({ id: result.meta.last_row_id }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create calculator' }, 500)
  }
})

// 更新计算器
calculatorRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const data = calculatorSchema.partial().parse(body)
    const payload = c.get('jwtPayload')
    
    await c.env.DB
      .prepare(`
        UPDATE calculators SET
          name = COALESCE(?, name),
          slug = COALESCE(?, slug),
          description = COALESCE(?, description),
          url = COALESCE(?, url),
          icon = COALESCE(?, icon),
          category_id = COALESCE(?, category_id),
          featured = COALESCE(?, featured),
          meta_title = COALESCE(?, meta_title),
          meta_description = COALESCE(?, meta_description),
          education_title = COALESCE(?, education_title),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(
        data.name, data.slug, data.description, data.url, data.icon,
        data.category_id, data.featured ? 1 : 0,
        data.meta_title, data.meta_description, data.education_title, id
      )
      .run()
    
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'update', 'calculator', id)
      .run()
    
    return c.json({ message: 'Calculator updated' })
  } catch (error) {
    return c.json({ error: 'Failed to update calculator' }, 500)
  }
})

// 删除计算器
calculatorRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const payload = c.get('jwtPayload')
  
  await c.env.DB.prepare('DELETE FROM calculators WHERE id = ?').bind(id).run()
  
  await c.env.DB
    .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
    .bind(payload.sub, 'delete', 'calculator', id)
    .run()
  
  return c.json({ message: 'Calculator deleted' })
})

// 关联文章
calculatorRoutes.post('/:id/articles', async (c) => {
  const id = c.req.param('id')
  const { article_id, custom_title, custom_description, display_order } = await c.req.json()
  
  await c.env.DB
    .prepare('INSERT INTO calculator_articles (calculator_id, article_id, custom_title, custom_description, display_order) VALUES (?, ?, ?, ?, ?)')
    .bind(id, article_id, custom_title, custom_description, display_order || 0)
    .run()
  
  return c.json({ message: 'Article linked' })
})

// 关联工具
calculatorRoutes.post('/:id/tools', async (c) => {
  const id = c.req.param('id')
  const { related_id, custom_name, custom_description, display_order } = await c.req.json()
  
  await c.env.DB
    .prepare('INSERT INTO calculator_relations (calculator_id, related_calculator_id, custom_name, custom_description, display_order) VALUES (?, ?, ?, ?, ?)')
    .bind(id, related_id, custom_name, custom_description, display_order || 0)
    .run()
  
  return c.json({ message: 'Tool linked' })
})
