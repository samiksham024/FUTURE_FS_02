const axios = require('axios');

const API_URL = 'http://127.0.0.1:5000/api'; // Use 127.0.0.1 as established

async function verifyDelete() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const headers = { 'x-auth-token': token };

        console.log('2. Creating Temp Lead...');
        const createRes = await axios.post(`${API_URL}/leads`, {
            name: 'Delete Me',
            email: 'delete@me.com'
        }, { headers });
        const leadId = createRes.data._id;
        console.log('   Lead created with ID:', leadId);

        console.log('3. Deleting Lead...');
        const deleteRes = await axios.delete(`${API_URL}/leads/${leadId}`, { headers });
        console.log('   Delete Status:', deleteRes.status);
        console.log('   Delete Response:', deleteRes.data);

        console.log('4. Verifying Deletion...');
        try {
            await axios.get(`${API_URL}/leads/${leadId}`, { headers });
            console.error('FAILED: Lead still exists!');
        } catch (err) {
            if (err.response && err.response.status === 404) { // Get leads/{id} is not implemented to return 404 cleanly maybe, usually gets list.
                // Wait, getLeads returns list. Let's fetch list.
                console.log('   (GET /leads/:id might not be implemented, fetching list)');
            }
        }

        const listRes = await axios.get(`${API_URL}/leads`, { headers });
        const exists = listRes.data.find(l => l._id === leadId);
        if (!exists) {
            console.log('SUCCESS: Lead is gone from list.');
        } else {
            console.error('FAILED: Lead is still in list.');
        }

    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

verifyDelete();
