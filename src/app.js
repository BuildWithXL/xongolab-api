'use strict'

const fastify = require('fastify')

const multipart = require('@fastify/multipart')
const envPlugin = require('./plugins/env')
const corsPlugin = require('./plugins/cors')
const swaggerPlugin = require('./plugins/swagger')
const routes = require('./routes/index')

const isDev = process.env.NODE_ENV !== 'production'

const app = fastify({
  logger: {
    level: isDev ? 'info' : 'warn',
    ...(isDev && {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' }
      }
    })
  }
})

// Plugins — order matters: env → swagger → cors → multipart → routes
app.register(envPlugin)
app.register(swaggerPlugin)
app.register(corsPlugin)
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 1
  }
})

// API routes
app.register(routes, { prefix: '/api' })

// Health check
app.get('/health', { schema: { tags: ['Health'] } }, async () => ({
  status: 'ok',
  timestamp: new Date().toISOString()
}))

// Global error handler
app.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500

  if (error.validation) {
    return reply.status(400).send({
      success: false,
      message: 'Validation failed',
      errors: error.validation
    })
  }

  request.log.error({ err: error }, 'Unhandled error')

  return reply.status(statusCode).send({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : error.message
  })
})

module.exports = app
