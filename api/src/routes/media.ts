import { Hono } from 'hono'

export const mediaRoutes = new Hono()

mediaRoutes.get('/', async (c) => {
  const { page = '1', limit = '20' } = c.req.query()
  
  const media = await c.env.DB
    .prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .bind(limit, (parseInt(page) - 1) * parseInt(limit))
    .all()
  
  return c.json({ data: media.results })
})

mediaRoutes.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File
  const payload = c.get('jwtPayload')
  
  if (!file) {
    return c.json({ error: 'No file' }, 400)
  }
  
  const filename = `${Date.now()}-${file.name}`
  await c.env.MEDIA.put(filename, file.stream())
  
  const url = `https://media.smartlock.com/${filename}`
  
  const result = await c.env.DB
    .prepare('INSERT INTO media (filename, original_name, url, mime_type, size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(filename, file.name, url, file.type, file.size, payload.sub)
    .run()
  
  return c.json({ id: result.meta.last_row_id, url }, 201)
})

mediaRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const media = await c.env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first() as any
  
  if (media) {
    await c.env.MEDIA.delete(media.filename)
    await c.env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run()
  }
  
  return c.json({ message: 'Deleted' })
})
