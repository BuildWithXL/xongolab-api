'use strict'

const fp = require('fastify-plugin')
const corsPlugin = require('@fastify/cors')

module.exports = fp(async function registerCors(fastify) {
  const rawOrigin = process.env.CORS_ORIGIN || '*'

  // Support comma-separated origins or wildcard
  const origin = rawOrigin === '*'
    ? '*'
    : rawOrigin.split(',').map(o => o.trim())

  await fastify.register(corsPlugin, {
    origin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
}, { name: 'cors' })
