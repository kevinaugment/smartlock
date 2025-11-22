import { Context, Next } from 'hono'

// 简单的速率限制中间件
const requestCounts = new Map<string, { count: number; resetAt: number }>()

export async function rateLimit(c: Context, next: Next) {
  const ip = c.req.header('cf-connecting-ip') || 'unknown'
  const now = Date.now()
  
  const record = requestCounts.get(ip)
  
  if (record && record.resetAt > now) {
    if (record.count >= 100) { // 100 requests per minute
      return c.json({ error: 'Too many requests' }, 429)
    }
    record.count++
  } else {
    requestCounts.set(ip, {
      count: 1,
      resetAt: now + 60000, // 1 minute
    })
  }
  
  await next()
}
