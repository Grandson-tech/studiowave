// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.querySelector('.toggle-password');
const errorMessage = document.getElementById('loginError');
const rememberMe = document.getElementById('remember');

// Sample Artist Data (in a real application, this would be stored securely on the server)
const sampleArtist = {
    email: 'artist@studiowave.com',
    password: 'artist123', // In a real application, this would be hashed
    name: 'The Groove Band',
    genre: 'Jazz/Funk',
    type: 'artist'
};

// Initialize artist data in localStorage if it doesn't exist
if (!localStorage.getItem('artists')) {
    localStorage.setItem('artists', JSON.stringify([sampleArtist]));
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

    // Get artists from localStorage
    const artists = JSON.parse(localStorage.getItem('artists') || '[]');
    
    // Find artist
    const artist = artists.find(a => a.email === email);

    if (!artist) {
        showError('Invalid email or password');
        return;
    }

    if (password !== artist.password) { // In a real app, use proper password hashing
        showError('Invalid email or password');
        return;
    }

    // Store artist session
    const session = {
        name: artist.name,
        email: artist.email,
        genre: artist.genre,
        type: artist.type,
        isAuthenticated: true
    };

    if (rememberMe.checked) {
        localStorage.setItem('artistSession', JSON.stringify(session));
    } else {
        sessionStorage.setItem('artistSession', JSON.stringify(session));
    }

    // Redirect to artist dashboard
    window.location.href = 'artist-dashboard.html';
});

// Check if user is already logged in
function checkAuth() {
    const session = JSON.parse(localStorage.getItem('artistSession') || sessionStorage.getItem('artistSession') || '{}');
    
    if (session.isAuthenticated) {
        window.location.href = 'artist-dashboard.html';
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