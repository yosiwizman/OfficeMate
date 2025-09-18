#!/usr/bin/env node
import http from 'node:http'

const host = 'localhost'
const port = 3000

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host, port, path, method: 'GET' }, (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => resolve({ status: res.statusCode || 0, body: data }))
    })
    req.on('error', reject)
    req.end()
  })
}

const main = async () => {
  const health = await get('/api/health')
  if (!/\{"ok":true\}/.test(health.body)) {
    console.error('Health check failed:', health.status, health.body)
    process.exit(1)
  }
  const desk = await get('/desktop')
  if (!desk.body || desk.status !== 200) {
    console.error('Desktop route failed:', desk.status)
    process.exit(1)
  }
  console.log('Smoke OK')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
