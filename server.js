'use strict'

// Load .env before any other module reads process.env
require('dotenv').config()

const app = require('./src/app')

const start = async () => {
  try {
    const host = process.env.HOST || '0.0.0.0'
    const port = parseInt(process.env.PORT || '3000', 10)

    await app.listen({ host, port })

    console.log(`\n  Server   : http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`)
    console.log(`  Docs     : http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/documentation`)
    console.log(`  Health   : http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/health\n`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
