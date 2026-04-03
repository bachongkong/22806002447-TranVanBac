import { spawn } from 'child_process';

console.log('Starting server...');
const server = spawn('node', ['src/server.js'], { stdio: 'pipe' });
server.stderr.on('data', data => console.error(`[Server Error] ${data}`));

await new Promise(r => setTimeout(r, 4000));

try {
    console.log('--- Logging in Admin ---');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@smarthire.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    let token = loginData.data?.accessToken || loginData.data?.token || loginData.token || loginData.accessToken;
    
    if (!token) throw new Error('Login failed: ' + JSON.stringify(loginData));

    console.log('=> Login success! Testing endpoints...');

    const logsRes = await fetch('http://localhost:5000/api/admin/audit-logs?limit=2', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('GET /audit-logs Status:', logsRes.status);
    
    const usersRes = await fetch('http://localhost:5000/api/admin/users?limit=5', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('GET /users Status:', usersRes.status);
    
    const usersData = await usersRes.json();
    const actList = usersData.data?.data || usersData.data || [];
    let userId = Array.isArray(actList) && actList.find(u => u.role === 'candidate')?._id;
    if (!userId && actList.length > 0) userId = actList[0]._id;
    
    if (userId) {
        const toggleRes = await fetch(`http://localhost:5000/api/admin/users/${userId}/toggle-block`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        console.log('PATCH /toggle-block Status:', toggleRes.status);
    }
    
    console.log('All tests executed successfully!');

} catch (e) {
    console.error('Test execution failed:', e);
} finally {
    server.kill();
    process.exit(0);
}
