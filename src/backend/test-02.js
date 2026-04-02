import { spawn } from 'child_process';

console.log('Starting server...');
const server = spawn('node', ['src/server.js'], { stdio: 'pipe' });

// Log server errors if any
server.stderr.on('data', data => console.error(`[Server Error] ${data}`));
server.stdout.on('data', data => console.log(`[Server] ${data}`));

// wait 3 seconds to ensure server boots
await new Promise(r => setTimeout(r, 3000));

try {
    console.log('Attempting login...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@smarthire.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    
    let token = loginData.data?.accessToken || loginData.data?.token || loginData.token || loginData.accessToken;
    
    if (!token) {
        console.error('Login failed payload:', loginData);
    } else {
        console.log('Login success. Token acquired!');
        console.log('Fetching audit logs...');
        const res = await fetch('http://localhost:5000/api/admin/audit-logs?limit=2', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('GET /audit-logs Status:', res.status);
        console.log('Response Data:', JSON.stringify(await res.json(), null, 2));
    }
} catch (e) {
    console.error('Test execution failed:', e);
} finally {
    server.kill();
    process.exit(0);
}
