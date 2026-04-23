'use strict'

const { contactUsSchema } = require('../schemas/contactUsSchema')
const { submit } = require('../controllers/contactUsController')

module.exports = async function contactUsRoutes(fastify) {
  fastify.post('/contact-us', { schema: contactUsSchema }, submit)
}
