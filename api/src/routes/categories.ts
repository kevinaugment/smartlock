import { Hono } from 'hono'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  parent_id: z.number().optional(),
  display_order: z.number().optional(),
})

export const categoryRoutes = new Hono()

// 获取所有分类（树形结构）
categoryRoutes.get('/', async (c) => {
  const categories = await c.env.DB
    .prepare('SELECT * FROM categories ORDER BY display_order ASC, name ASC')
    .all()
  
  // 构建树形结构
  const buildTree = (items: any[], parentId: number | null = null): any[] => {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id)
      }))
  }
  
  return c.json({ data: buildTree(categories.results) })
})

// 获取单个分类
categoryRoutes.get('/:id', async (c) => {
  const category = await c.env.DB
    .prepare('SELECT * FROM categories WHERE id = ? OR slug = ?')
    .bind(c.req.param('id'), c.req.param('id'))
    .first()
  
  if (!category) {
    return c.json({ error: 'Category not found' }, 404)
  }
  
  // 获取该分类下的文章数
  const { count } = await c.env.DB
    .prepare('SELECT COUNT(*) as count FROM articles WHERE category_id = ?')
    .bind(category.id)
    .first() as any
  
  return c.json({ ...category, article_count: count })
})

// 创建分类
categoryRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const data = categorySchema.parse(body)
    const payload = c.get('jwtPayload')
    
    const result = await c.env.DB
      .prepare(`
        INSERT INTO categories (name, slug, description, icon, parent_id, display_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        data.name,
        data.slug,
        data.description,
        data.icon,
        data.parent_id,
        data.display_order || 0
      )
      .run()
    
    // 审计日志
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'create', 'category', result.meta.last_row_id)
      .run()
    
    return c.json({ id: result.meta.last_row_id }, 201)
  } catch (error) {
    console.error('Create category error:', error)
    return c.json({ error: 'Failed to create category' }, 500)
  }
})

// 更新分类
categoryRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const data = categorySchema.partial().parse(body)
    const payload = c.get('jwtPayload')
    
    await c.env.DB
      .prepare(`
        UPDATE categories SET
          name = COALESCE(?, name),
          slug = COALESCE(?, slug),
          description = COALESCE(?, description),
          icon = COALESCE(?, icon),
          parent_id = COALESCE(?, parent_id),
          display_order = COALESCE(?, display_order),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(data.name, data.slug, data.description, data.icon, data.parent_id, data.display_order, id)
      .run()
    
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'update', 'category', id)
      .run()
    
    return c.json({ message: 'Category updated' })
  } catch (error) {
    return c.json({ error: 'Failed to update category' }, 500)
  }
})

// 删除分类
categoryRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const payload = c.get('jwtPayload')
  
  // 检查是否有文章使用此分类
  const { count } = await c.env.DB
    .prepare('SELECT COUNT(*) as count FROM articles WHERE category_id = ?')
    .bind(id)
    .first() as any
  
  if (count > 0) {
    return c.json({ error: 'Cannot delete category with articles' }, 400)
  }
  
  await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
  
  await c.env.DB
    .prepare('INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)')
    .bind(payload.sub, 'delete', 'category', id)
    .run()
  
  return c.json({ message: 'Category deleted' })
})
