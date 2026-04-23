'use strict'

const fp = require('fastify-plugin')
const envPlugin = require('@fastify/env')

const schema = {
  type: 'object',
  required: ['SENDGRID_API_KEY', 'FROM_EMAIL', 'ADMIN_EMAIL'],
  properties: {
    PORT: { type: 'string', default: '3000' },
    HOST: { type: 'string', default: '0.0.0.0' },
    NODE_ENV: { type: 'string', default: 'development' },
    SENDGRID_API_KEY: { type: 'string' },
    FROM_EMAIL: { type: 'string' },
    FROM_NAME: { type: 'string', default: 'Xongolab' },
    ADMIN_EMAIL: { type: 'string' },
    HR_EMAIL: { type: 'string', default: '' },
    CORS_ORIGIN: { type: 'string', default: '*' }
  }
}

module.exports = fp(async function registerEnv(fastify) {
  await fastify.register(envPlugin, { schema })
}, { name: 'env' })
