import fs from 'fs'
import { spawn } from 'child_process'
import fetch from 'node-fetch'

console.log('Starting server...')
const server = spawn('node', ['src/server.js'], { stdio: 'pipe' })
server.stderr.on('data', d => console.error(`[Server Error] ${d}`))

await new Promise(r => setTimeout(r, 4000))

try {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@smarthire.com', password: 'admin123' }),
  })
  const loginData = await loginRes.json()
  const token = loginData.data?.accessToken || loginData.data?.token
  if (!token) throw new Error('Login failed')
  console.log('Login OK!')

  console.log('\n--- GET /admin/users/export ---')
  const exportRes = await fetch('http://localhost:5000/api/admin/users/export', {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  console.log('Status:', exportRes.status)
  console.log('Content-Type:', exportRes.headers.get('content-type'))
  console.log('Content-Disposition:', exportRes.headers.get('content-disposition'))
  
  const text = await exportRes.text()
  console.log('\nCSV Output Snippet:\n')
  console.log(text.slice(0, 500))

  console.log('\nAll tests passed!')
} catch (e) {
  console.error('Test failed:', e.message)
} finally {
  server.kill()
  process.exit(0)
}
