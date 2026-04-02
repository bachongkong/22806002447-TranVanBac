import fs from 'fs';
import { spawn } from 'child_process';

const csvContent = `type,value,label,isActive
skill,nodejs,Node.js,1
skill,react,React JS,1
industry,tech,Công nghệ,1`;

fs.writeFileSync('mock-data.csv', csvContent);

console.log('Starting server...');
const server = spawn('node', ['src/server.js'], { stdio: 'pipe' });
server.stderr.on('data', d => console.error(`[Server Error] ${d}`));

await new Promise(r => setTimeout(r, 4000));

try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@smarthire.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    let token = loginData.data?.accessToken || loginData.data?.token || loginData.token;
    
    console.log('Admin Token acquired:', !!token);

    const formData = new FormData();
    const blob = new Blob([fs.readFileSync('mock-data.csv')], { type: 'text/csv' });
    formData.append('file', blob, 'mock-data.csv');

    console.log('Uploading mock-data.csv...');
    const res = await fetch('http://localhost:5000/api/admin/master-data/import', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
    
    console.log('Status Response:', res.status);
    const json = await res.json();
    console.log('Payload Data:', JSON.stringify(json, null, 2));

} catch (e) {
    console.error('Test script crashed:', e);
} finally {
    server.kill();
    process.exit(0);
}
