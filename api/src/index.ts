import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { authRoutes } from './routes/auth'
import { articleRoutes } from './routes/articles'
import { calculatorRoutes } from './routes/calculators'
import { categoryRoutes } from './routes/categories'
import { pageRoutes } from './routes/pages'
import { settingsRoutes } from './routes/settings'
import { mediaRoutes } from './routes/media'
import { analyticsRoutes } from './routes/analytics'
import { searchRoutes } from './routes/search'

type Bindings = {
  DB: D1Database
  MEDIA: R2Bucket
  SESSIONS: KVNamespace
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS配置
app.use('/*', cors({
  origin: ['http://localhost:4321', 'http://localhost:5173', 'https://smartlock.com', 'https://admin.smartlock.com'],
  credentials: true,
}))

// 公开路由
app.route('/api/auth', authRoutes)

// JWT保护的路由
app.use('/api/*', async (c, next) => {
  const publicPaths = ['/api/auth/login', '/api/auth/register']
  if (publicPaths.includes(c.req.path)) {
    return next()
  }
  
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  })
  
  return jwtMiddleware(c, next)
})

// API路由
app.route('/api/articles', articleRoutes)
app.route('/api/calculators', calculatorRoutes)
app.route('/api/categories', categoryRoutes)
app.route('/api/pages', pageRoutes)
app.route('/api/settings', settingsRoutes)
app.route('/api/media', mediaRoutes)
app.route('/api/analytics', analyticsRoutes)
app.route('/api/search', searchRoutes)

// 健康检查
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

// 404处理
app.notFound((c) => c.json({ error: 'Not Found' }, 404))

// 错误处理
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message }, 500)
})

export default app
