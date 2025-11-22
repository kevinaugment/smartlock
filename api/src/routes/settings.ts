import { Hono } from 'hono'

export const settingsRoutes = new Hono()

// 获取所有设置（按分类分组）
settingsRoutes.get('/', async (c) => {
  const { category } = c.req.query()
  
  let query = 'SELECT * FROM settings WHERE 1=1'
  const params: any[] = []
  
  if (category) {
    query += ' AND category = ?'
    params.push(category)
  }
  
  query += ' ORDER BY category ASC, key ASC'
  
  const settings = await c.env.DB.prepare(query).bind(...params).all()
  
  // 按分类分组
  const grouped = settings.results.reduce((acc: any, setting: any) => {
    if (!acc[setting.category]) {
      acc[setting.category] = []
    }
    acc[setting.category].push(setting)
    return acc
  }, {})
  
  return c.json({ data: grouped })
})

// 获取单个设置
settingsRoutes.get('/:key', async (c) => {
  const key = c.req.param('key')
  
  const setting = await c.env.DB
    .prepare('SELECT * FROM settings WHERE key = ?')
    .bind(key)
    .first()
  
  if (!setting) {
    return c.json({ error: 'Setting not found' }, 404)
  }
  
  // 解析JSON类型的值
  if (setting.type === 'json' && setting.value) {
    setting.value = JSON.parse(setting.value)
  }
  
  return c.json(setting)
})

// 更新设置
settingsRoutes.put('/:key', async (c) => {
  try {
    const key = c.req.param('key')
    const { value } = await c.req.json()
    const payload = c.get('jwtPayload')
    
    // 检查设置是否存在
    const existing = await c.env.DB
      .prepare('SELECT * FROM settings WHERE key = ?')
      .bind(key)
      .first()
    
    if (!existing) {
      return c.json({ error: 'Setting not found' }, 404)
    }
    
    // 处理JSON类型
    let finalValue = value
    if (existing.type === 'json' && typeof value === 'object') {
      finalValue = JSON.stringify(value)
    }
    
    await c.env.DB
      .prepare('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?')
      .bind(finalValue, key)
      .run()
    
    // 审计日志
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, changes) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'update', 'setting', JSON.stringify({ key, value }))
      .run()
    
    return c.json({ message: 'Setting updated' })
  } catch (error) {
    return c.json({ error: 'Failed to update setting' }, 500)
  }
})

// 批量更新设置
settingsRoutes.post('/batch', async (c) => {
  try {
    const { settings } = await c.req.json()
    const payload = c.get('jwtPayload')
    
    for (const [key, value] of Object.entries(settings)) {
      const existing = await c.env.DB
        .prepare('SELECT * FROM settings WHERE key = ?')
        .bind(key)
        .first()
      
      if (!existing) continue
      
      let finalValue = value
      if (existing.type === 'json' && typeof value === 'object') {
        finalValue = JSON.stringify(value)
      }
      
      await c.env.DB
        .prepare('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?')
        .bind(finalValue, key)
        .run()
    }
    
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, changes) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'update', 'setting', JSON.stringify(settings))
      .run()
    
    return c.json({ message: 'Settings updated' })
  } catch (error) {
    return c.json({ error: 'Failed to update settings' }, 500)
  }
})

// 获取导航菜单
settingsRoutes.get('/navigation/:location', async (c) => {
  const location = c.req.param('location')
  
  const items = await c.env.DB
    .prepare('SELECT * FROM navigation WHERE location = ? ORDER BY display_order ASC')
    .bind(location)
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
  
  return c.json({ data: buildTree(items.results) })
})

// 更新导航菜单
settingsRoutes.post('/navigation', async (c) => {
  try {
    const { location, items } = await c.req.json()
    const payload = c.get('jwtPayload')
    
    // 删除现有菜单
    await c.env.DB
      .prepare('DELETE FROM navigation WHERE location = ?')
      .bind(location)
      .run()
    
    // 插入新菜单
    for (const item of items) {
      await c.env.DB
        .prepare('INSERT INTO navigation (location, label, url, parent_id, display_order, target, icon) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(location, item.label, item.url, item.parent_id, item.display_order || 0, item.target || '_self', item.icon)
        .run()
    }
    
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, changes) VALUES (?, ?, ?, ?)')
      .bind(payload.sub, 'update', 'navigation', JSON.stringify({ location, items }))
      .run()
    
    return c.json({ message: 'Navigation updated' })
  } catch (error) {
    return c.json({ error: 'Failed to update navigation' }, 500)
  }
})
