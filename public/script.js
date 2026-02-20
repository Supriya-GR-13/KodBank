const API_URL = 'http://localhost:3000';

// Toggle Forms
function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

// Register
async function register() {
    const uid = document.getElementById('reg-uid').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, username, password, email, phone })
        });
        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            showLogin();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

// Login
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            // Token is in cookie, but also in data if needed. 
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

// Check Balance
async function checkBalance() {
    try {
        const response = await fetch(`${API_URL}/balance`);
        const data = await response.json();

        if (response.ok) {
            const balanceDisplay = document.getElementById('balance-display');
            const checkBalanceBtn = document.getElementById('check-balance-btn');

            const formattedBalance = parseFloat(data.balance).toFixed(2);
            balanceDisplay.innerText = `Your balance is :${formattedBalance}`;

            // Hide the button
            checkBalanceBtn.classList.add('hidden');

            triggerConfetti();
        } else {
            alert(data.message);
            if (response.status === 401) {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

// Logout
function logout() {
    // Clear cookie (client-side attempt, though best done by server)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'index.html';
}

// Confetti Animation
function triggerConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}
