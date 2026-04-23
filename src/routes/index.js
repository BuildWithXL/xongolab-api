'use strict'

const freeConsultation = require('./freeConsultation')
const contactUs = require('./contactUs')
const applyJob = require('./applyJob')

module.exports = async function routes(fastify) {
  fastify.register(freeConsultation)
  fastify.register(contactUs)
  fastify.register(applyJob)
}
