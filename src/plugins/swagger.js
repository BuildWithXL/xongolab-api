'use strict'

const fp = require('fastify-plugin')
const swagger = require('@fastify/swagger')
const swaggerUi = require('@fastify/swagger-ui')

module.exports = fp(async function registerSwagger(fastify) {
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Xongolab API',
        description: 'Form submission APIs with SendGrid email integration.\n\n' +
          'Each endpoint accepts a form payload, sends a **thank-you email** to the user, ' +
          'and a **notification email** to the admin/HR team.',
        version: '1.0.0',
        contact: {
          name: 'Xongolab',
          email: 'support@xongolab.com'
        }
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local development' }
      ],
      tags: [
        { name: 'Health', description: 'API health check' },
        { name: 'Free Consultation', description: 'Free consultation form' },
        { name: 'Contact Us', description: 'General contact form' },
        { name: 'Discuss Requirements', description: 'Project requirements form' },
        { name: 'Apply for Job', description: 'Job application form' }
      ]
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  })
}, { name: 'swagger' })
