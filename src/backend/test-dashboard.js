import { spawn } from 'child_process';
import fetch from 'node-fetch';

console.log('Starting server...');
const server = spawn('node', ['src/server.js'], { stdio: 'pipe' });
server.stderr.on('data', d => console.error(`${d}`));

await new Promise(r => setTimeout(r, 4000));

try {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@smarthire.com', password: 'admin123' })
  });
  const data = await loginRes.json();
  const token = data.data?.accessToken || data.data?.token;

  console.log('\n--- GET /admin/dashboard ---');
  const dStart = Date.now();
  const dRes = await fetch('http://localhost:5000/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const dTime = Date.now() - dStart;
  
  console.log(`Status: ${dRes.status} (took ${dTime}ms)`);
  
  if (dRes.status === 200) {
    const dJson = await dRes.json();
    console.log(JSON.stringify(dJson.data, null, 2));
    
    if (dTime < 500) {
      console.log('✅ Performance threshold respected');
    } else {
      console.log('⚠️ Performance took longer than 500ms');
    }
  } else {
      console.error(await dRes.text());
  }

} finally {
  server.kill();
  process.exit(0);
}
