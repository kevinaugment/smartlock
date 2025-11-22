import { Hono } from 'hono'

export const analyticsRoutes = new Hono()

analyticsRoutes.get('/stats', async (c) => {
  const articles = await c.env.DB.prepare('SELECT COUNT(*) as count FROM articles').first() as any
  const calculators = await c.env.DB.prepare('SELECT COUNT(*) as count FROM calculators').first() as any
  const views = await c.env.DB.prepare('SELECT SUM(view_count) as total FROM articles').first() as any
  
  return c.json({
    articles: articles.count,
    calculators: calculators.count,
    views: views.total || 0,
    engagement: '85%'
  })
})

analyticsRoutes.get('/popular', async (c) => {
  const articles = await c.env.DB
    .prepare('SELECT * FROM articles ORDER BY view_count DESC LIMIT 10')
    .all()
  
  return c.json({ data: articles.results })
})
