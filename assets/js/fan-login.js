document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorMessage = document.getElementById('errorMessage');
    const rememberMe = document.getElementById('rememberMe');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Check if user is already logged in
    function checkAuth() {
        const loggedInUser = sessionStorage.getItem('currentFan') || localStorage.getItem('currentFan');
        if (loggedInUser) {
            window.location.href = 'fan-dashboard.html';
        }
    }

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Get fans from localStorage
        const fans = JSON.parse(localStorage.getItem('fans')) || [];
        const fan = fans.find(f => f.email === email);

        if (!fan) {
            showError('No account found with this email');
            return;
        }

        // Check password (in a real app, this would use proper password hashing)
        if (btoa(password) !== fan.password) {
            showError('Invalid password');
            return;
        }

        // Store user session
        const fanData = {
            id: fan.id,
            name: fan.name,
            email: fan.email,
            role: 'fan'
        };

        if (rememberMe.checked) {
            localStorage.setItem('currentFan', JSON.stringify(fanData));
        } else {
            sessionStorage.setItem('currentFan', JSON.stringify(fanData));
        }

        // Redirect to fan dashboard
        window.location.href = 'fan-dashboard.html';
    });

    // Initialize
    checkAuth();
    
    // Auto-fill email if remembered
    const rememberedFan = localStorage.getItem('currentFan');
    if (rememberedFan) {
        const fanData = JSON.parse(rememberedFan);
        emailInput.value = fanData.email;
        rememberMe.checked = true;
    }
}); 