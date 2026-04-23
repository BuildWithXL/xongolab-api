'use strict'

const { applyJobSchema } = require('../schemas/applyJobSchema')
const { submit } = require('../controllers/applyJobController')

module.exports = async function applyJobRoutes(fastify) {
  fastify.post('/apply-job', { schema: applyJobSchema }, submit)
}
