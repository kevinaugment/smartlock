import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { compare, hash } from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
})

export const authRoutes = new Hono()

// 登录
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password } = loginSchema.parse(body)
    
    // 查询用户
    const user = await c.env.DB
      .prepare('SELECT * FROM users WHERE email = ? AND is_active = 1')
      .bind(email)
      .first()
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    // 验证密码
    const validPassword = await compare(password, user.password_hash)
    if (!validPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    // 生成JWT
    const token = await sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7天
      },
      c.env.JWT_SECRET
    )
    
    // 更新最后登录时间
    await c.env.DB
      .prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(user.id)
      .run()
    
    // 记录审计日志
    await c.env.DB
      .prepare('INSERT INTO audit_logs (user_id, action, entity_type, ip_address) VALUES (?, ?, ?, ?)')
      .bind(user.id, 'login', 'user', c.req.header('cf-connecting-ip'))
      .run()
    
    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// 注册（仅限管理员创建）
authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const { email, password, name } = registerSchema.parse(body)
    
    // 检查用户是否已存在
    const existing = await c.env.DB
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first()
    
    if (existing) {
      return c.json({ error: 'Email already exists' }, 400)
    }
    
    // Hash密码
    const password_hash = await hash(password, 10)
    
    // 创建用户
    const result = await c.env.DB
      .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
      .bind(email, password_hash, name)
      .run()
    
    return c.json({
      id: result.meta.last_row_id,
      email,
      name,
    }, 201)
  } catch (error) {
    console.error('Register error:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// 获取当前用户信息
authRoutes.get('/me', async (c) => {
  const payload = c.get('jwtPayload')
  
  const user = await c.env.DB
    .prepare('SELECT id, email, name, role, avatar_url, created_at FROM users WHERE id = ?')
    .bind(payload.sub)
    .first()
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  
  return c.json(user)
})

// 登出
authRoutes.post('/logout', (c) => {
  // 客户端删除token即可
  return c.json({ message: 'Logged out successfully' })
})
