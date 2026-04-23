'use strict'

const { freeConsultationSchema } = require('../schemas/freeConsultationSchema')
const { submit } = require('../controllers/freeConsultationController')

module.exports = async function freeConsultationRoutes(fastify) {
  fastify.post('/free-consultation', { schema: freeConsultationSchema }, submit)
}
