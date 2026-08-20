const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 'effe52a6-9714-4b02-9d10-abf544d74396' }, 'supersecretkey_edustack_pro_2024', { expiresIn: '1d' });
console.log("Generated JWT Token:", token);

const BASE_URL = 'https://backend-production-a649.up.railway.app';

const endpoints = [
  '/api/mentor/students',
  '/api/mentor/shortage',
  '/api/mentor/leaves',
  '/api/mentor/sessions',
  '/api/announcements'
];

async function runTests() {
  for (const ep of endpoints) {
    console.log(`\nTesting production endpoint: ${ep}...`);
    try {
      const res = await axios.get(`${BASE_URL}${ep}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`[Success] Status: ${res.status}, data length/type:`, Array.isArray(res.data) ? res.data.length : typeof res.data);
    } catch (err) {
      console.error(`[Error] Status: ${err.response?.status}, message:`, err.response?.data || err.message);
    }
  }
}

runTests();
