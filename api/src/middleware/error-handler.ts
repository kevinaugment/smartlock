import { Context } from 'hono'

export async function errorHandler(err: Error, c: Context) {
  console.error('Error:', err)
  
  // Zod validation errors
  if (err.name === 'ZodError') {
    return c.json(
      {
        error: 'Validation failed',
        details: JSON.parse(err.message),
      },
      400
    )
  }
  
  // Database errors
  if (err.message.includes('UNIQUE constraint')) {
    return c.json(
      {
        error: 'Duplicate entry',
        message: 'A record with this value already exists',
      },
      409
    )
  }
  
  // Default error
  return c.json(
    {
      error: 'Internal server error',
      message: err.message,
    },
    500
  )
}
