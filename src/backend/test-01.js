import { spawn } from 'child_process';

console.log('Starting server...');
const server = spawn('node', ['src/server.js'], { stdio: 'pipe' });

// Log server errors if any
server.stderr.on('data', data => console.error(`[Server Error] ${data}`));
// server.stdout.on('data', data => console.log(`[Server] ${data}`));

// wait 3 seconds to ensure server boots
await new Promise(r => setTimeout(r, 4000));

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
        console.log('Login success!');
        
        console.log('Fetching users...');
        const res = await fetch('http://localhost:5000/api/admin/users?limit=5', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const usersData = await res.json();
        console.log('GET /users Status:', res.status);
        
        const userList = usersData.data?.data || usersData.data || [];
        
        let candidateId = null;
        if (Array.isArray(userList)) {
            candidateId = userList.find(u => u.role === 'candidate')?._id;
            if(!candidateId && userList.length > 0) candidateId = userList[0]._id;
        }

        if(candidateId) {
            console.log('Toggling block for user:', candidateId);
            const blockRes = await fetch(`http://localhost:5000/api/admin/users/${candidateId}/toggle-block`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            console.log('PATCH toggle-block Status:', blockRes.status);
            const blockData = await blockRes.json();
            console.log('Block returned status payload:', blockData.success || blockData);
        } else {
            console.log('No user array returned to test block:', Object.keys(usersData));
        }
    }
} catch (e) {
    console.error('Test execution failed:', e);
} finally {
    server.kill();
    process.exit(0);
}
