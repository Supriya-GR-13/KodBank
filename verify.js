// Node 22 has built-in fetch, no require needed
const BASE_URL = 'http://localhost:3000';

async function test() {
    console.log('Starting verification...');

    // 1. Register
    const user = {
        uid: 'u3' + Date.now(),
        username: 'testverify' + Date.now().toString().slice(-4), // Shorten to avoid length issues
        password: 'password123',
        email: 'test@verify.com',
        phone: '9998887776'
    };

    console.log('Testing Registration for user:', user.username);
    try {
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (regRes.status === 201) {
            console.log('✅ Registration Successful');
        } else {
            console.log('❌ Registration Failed:', await regRes.text());
            return;
        }

        // 2. Login
        console.log('Testing Login...');
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, password: user.password })
        });

        if (loginRes.status === 200) {
            console.log('✅ Login Successful');
        } else {
            console.log('❌ Login Failed:', await loginRes.text());
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token;

        // 3. Check Balance
        console.log('Testing Balance Check...');
        const balanceRes = await fetch(`${BASE_URL}/balance`, {
            headers: {
                'Cookie': `token=${token}`,
                'Authorization': `Bearer ${token}`
            }
        });

        if (balanceRes.status === 200) {
            const balanceData = await balanceRes.json();
            // Compare as string to avoid precision issues, though 100000 is safe
            if (parseFloat(balanceData.balance) === 100000) {
                console.log(`✅ Balance Verified: ${balanceData.balance}`);
            } else {
                console.log(`❌ Balance Mismatch: Expected 100000, got ${balanceData.balance}`);
            }
        } else {
            console.log('❌ Balance Check Failed:', await balanceRes.text());
        }

    } catch (error) {
        console.error('Test Execution Error:', error);
    }
}

test();
