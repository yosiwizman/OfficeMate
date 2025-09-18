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

  const home = await get('/')
  if (!home.body || home.status !== 200) {
    console.error('Home failed:', home.status)
    process.exit(1)
  }

  const expectedIframe = process.env.NEXT_PUBLIC_DESKTOP_URL
  if (expectedIframe) {
    if (!home.body.includes('<iframe') || !home.body.includes(expectedIframe)) {
      console.error('Workspace iframe missing or URL mismatch')
      process.exit(1)
    }
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
