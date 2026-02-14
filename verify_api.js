const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verify() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token obtained.');

        // 2. Fetch Leads
        console.log('Fetching leads...');
        const leadsRes = await axios.get(`${API_URL}/leads`, {
            headers: { 'x-auth-token': token }
        });
        console.log(`Fetched ${leadsRes.data.length} leads.`);
        console.log('First lead:', leadsRes.data[0]);

        // 3. Create Lead
        console.log('Creating test lead...');
        const newLeadRes = await axios.post(`${API_URL}/leads`, {
            name: 'API Test User',
            email: 'api@test.com',
            phone: '5555555555',
            source: 'API Script'
        }, {
            headers: { 'x-auth-token': token }
        });
        console.log('Lead created:', newLeadRes.data.name);

        // 4. Fetch again
        const leadsRes2 = await axios.get(`${API_URL}/leads`, {
            headers: { 'x-auth-token': token }
        });
        console.log(`Fetched ${leadsRes2.data.length} leads after creation.`);

    } catch (err) {
        console.error('Verification Failed:', err.response ? err.response.data : err.message);
    }
}

verify();
