// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.querySelector('.toggle-password');
const errorMessage = document.getElementById('loginError');
const rememberMe = document.getElementById('remember');

// Admin Manager Credentials (in a real application, this would be stored securely on the server)
const adminManager = {
    email: 'admin@studiowave.com',
    password: 'admin123', // In a real application, this would be hashed
    name: 'John Doe',
    role: 'admin',
    isAdmin: true
};

// Initialize manager data in localStorage if it doesn't exist
if (!localStorage.getItem('managers')) {
    localStorage.setItem('managers', JSON.stringify([adminManager]));
}

// Toggle Password Visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.innerHTML = type === 'password' ? 
        '<i class="fas fa-eye"></i>' : 
        '<i class="fas fa-eye-slash"></i>';
});

// Show Error Message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');
    setTimeout(() => {
        errorMessage.classList.remove('visible');
    }, 3000);
}

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Get managers from localStorage
    const managers = JSON.parse(localStorage.getItem('managers') || '[]');
    
    // Find manager
    const manager = managers.find(m => m.email === email);

    if (!manager) {
        showError('Invalid email or password');
        return;
    }

    if (password !== manager.password) { // In a real app, use proper password hashing
        showError('Invalid email or password');
        return;
    }

    // Store manager session
    const session = {
        name: manager.name,
        email: manager.email,
        role: manager.role,
        isAdmin: manager.isAdmin,
        isAuthenticated: true
    };

    if (rememberMe.checked) {
        localStorage.setItem('managerSession', JSON.stringify(session));
    } else {
        sessionStorage.setItem('managerSession', JSON.stringify(session));
    }

    // Redirect to dashboard
    window.location.href = 'manager-dashboard.html';
});

// Check if user is already logged in
function checkAuth() {
    const session = JSON.parse(localStorage.getItem('managerSession') || sessionStorage.getItem('managerSession') || '{}');
    
    if (session.isAuthenticated) {
        window.location.href = 'manager-dashboard.html';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Auto-fill email if remembered
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMe.checked = true;
    }
}); 