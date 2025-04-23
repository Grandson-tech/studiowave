// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');
const errorMessage = document.getElementById('errorMessage');

// Default Manager Account
const defaultManager = {
    id: 1,
    name: "Studio Manager",
    email: "manager@studiowave.com",
    password: "Manager123", // Simple password for testing
    role: "manager",
    isAdmin: true
};

// Initialize the manager account
function initializeManager() {
    // Clear any existing data first
    localStorage.removeItem('managers');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Create fresh manager data
    const managers = [defaultManager];
    localStorage.setItem('managers', JSON.stringify(managers));
    console.log('Manager account initialized:', defaultManager);
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.querySelector('i').classList.toggle('fa-eye');
    togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
});

// Handle form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Get managers from localStorage
    const managers = JSON.parse(localStorage.getItem('managers') || '[]');
    console.log('Checking login for:', email);
    
    // Find matching manager
    const manager = managers.find(m => m.email === email);
    
    if (!manager) {
        showError('No account found with this email');
        return;
    }
    
    if (manager.password !== password) {
        showError('Invalid password');
        return;
    }
    
    // Create session data
    const sessionData = {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
        isAdmin: manager.isAdmin
    };
    
    // Store session data
    if (rememberMe.checked) {
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
    }
    
    console.log('Login successful, redirecting to dashboard...');
    window.location.href = 'manager-dashboard.html';
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the manager account
    initializeManager();
    
    // Check if already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.role === 'manager') {
        window.location.href = 'manager-dashboard.html';
    }
}); 