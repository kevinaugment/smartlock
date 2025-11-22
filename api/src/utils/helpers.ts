// 生成URL友好的slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// 计算阅读时间（分钟）
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// 提取描述（从内容的前150个字符）
export function extractDescription(content: string, maxLength = 150): string {
  const text = content.replace(/[#*`>\[\]]/g, '').trim()
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text
}

// 验证slug唯一性
export async function isSlugUnique(
  db: any,
  table: string,
  slug: string,
  excludeId?: number
): Promise<boolean> {
  let query = `SELECT id FROM ${table} WHERE slug = ?`
  const params = [slug]
  
  if (excludeId) {
    query += ' AND id != ?'
    params.push(excludeId)
  }
  
  const result = await db.prepare(query).bind(...params).first()
  return !result
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

// 清理HTML标签
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

// 生成随机字符串
export function randomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
