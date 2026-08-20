const https = require('https');

// First login to get a token
function login(email, password) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ email, password });
    const req = https.request({
      hostname: 'backend-production-a649.up.railway.app',
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function getStats(token) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'backend-production-a649.up.railway.app',
      path: '/api/dashboard/stats',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  // Try multiple possible credentials
  const accounts = [
    { email: 'neeraj123@gmail.com', password: 'password123' },
    { email: 'neeraj123@gmail.com', password: 'Neeraj@123' },
    { email: 'aryan1@gmail.com', password: 'password123' },
    { email: 'aryan1@gmail.com', password: 'aryan123' },
  ];

  for (const acc of accounts) {
    try {
      const loginRes = await login(acc.email, acc.password);
      if (loginRes.token) {
        console.log(`Login success for ${acc.email}!`);
        const stats = await getStats(loginRes.token);
        console.log('myTeachers:', JSON.stringify(stats.myTeachers, null, 2));
        console.log('classMentor:', JSON.stringify(stats.classMentor, null, 2));
        if (stats.message) console.log('ERROR from server:', stats.message);
        return;
      } else {
        console.log(`Login failed for ${acc.email}:`, loginRes.message);
      }
    } catch (err) {
      console.error(`Error for ${acc.email}:`, err.message);
    }
  }
}

run();
