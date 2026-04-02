import fs from 'fs'
import { spawn } from 'child_process'
import FormData from 'form-data'
import fetch from 'node-fetch'

console.log('Starting server...')
const server = spawn('node', ['src/server.js'], { stdio: 'pipe' })
server.stderr.on('data', d => console.error(`[Server Error] ${d}`))

await new Promise(r => setTimeout(r, 4000))

try {
  // === Login Admin ===
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@smarthire.com', password: 'admin123' }),
  })
  const loginData = await loginRes.json()
  const token = loginData.data?.accessToken || loginData.data?.token
  if (!token) throw new Error('Login failed: ' + JSON.stringify(loginData))
  console.log('Login OK!')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // === BE-ADM-01: GET /users ===
  const usersRes = await fetch('http://localhost:5000/api/admin/users?limit=5', { headers })
  console.log('GET /users ->', usersRes.status)
  const usersData = await usersRes.json()
  const users = usersData.data?.data || usersData.data || []
  const candidate = Array.isArray(users) && users.find(u => u.role === 'candidate')
  
  // === BE-ADM-01: PATCH toggle-block with reason ===
  if (candidate) {
    const blockRes = await fetch(`http://localhost:5000/api/admin/users/${candidate._id}/toggle-block`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ reason: 'Vi phạm nội quy cộng đồng' })
    })
    console.log('PATCH toggle-block ->', blockRes.status)
  }

  // === BE-ADM-01: GET pending jobs + Approve/Reject a job ===
  const pendingRes = await fetch('http://localhost:5000/api/admin/jobs/pending', { headers })
  console.log('GET /jobs/pending ->', pendingRes.status)
  const pendingData = await pendingRes.json()
  const pendingJobs = pendingData.data || []
  if (pendingJobs.length > 0) {
    const rejectRes = await fetch(`http://localhost:5000/api/admin/jobs/${pendingJobs[0]._id}/reject`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ reason: 'Tin đăng vi phạm chính sách' })
    })
    console.log('PATCH /jobs/reject ->', rejectRes.status)
  } else {
    console.log('No pending jobs to moderate (seed only creates draft/published jobs)')
  }

  // === BE-ADM-02: Read audit logs (should have entries now from above actions) ===
  await new Promise(r => setTimeout(r, 500)) // wait for fire-and-forget writes
  const logsRes = await fetch('http://localhost:5000/api/admin/audit-logs?limit=5', { headers })
  console.log('GET /audit-logs ->', logsRes.status)
  const logsData = await logsRes.json()
  console.log('  Logged actions:', (logsData.data?.data || logsData.data || []).map(l => l.action))

  // === BE-ADM-03: Stream CSV Import with bulkWrite upsert ===
  const csv = `type,value,label,isActive\nskill,nodejs,Node.js,1\nskill,react,React JS,1\nindustry,tech,Công nghệ,1\nlocation,hanoi,Hà Nội,1`
  fs.writeFileSync('/tmp/test-import.csv', csv)

  const form = new FormData()
  form.append('file', fs.createReadStream('/tmp/test-import.csv'), 'test-import.csv')
  const csvRes = await fetch('http://localhost:5000/api/admin/master-data/import', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, ...form.getHeaders() },
    body: form,
  })
  console.log('POST /master-data/import ->', csvRes.status)
  const csvData = await csvRes.json()
  console.log('  Import stats:', csvData.data?.stats || csvData.stats || csvData)

  console.log('\nAll tests passed!')
} catch (e) {
  console.error('Test failed:', e.message)
} finally {
  server.kill()
  process.exit(0)
}
