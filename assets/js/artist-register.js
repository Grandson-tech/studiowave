document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('artistRegisterForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const errorDiv = document.getElementById('registerError');

    // Password visibility toggle handlers
    passwordToggle.addEventListener('click', () => togglePasswordVisibility(passwordInput, passwordToggle));
    confirmPasswordToggle.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle));

    function togglePasswordVisibility(input, icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase || !hasLowerCase) {
            return 'Password must contain both uppercase and lowercase letters';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return '';
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const artistName = document.getElementById('artistName').value.trim();
        const email = document.getElementById('email').value.trim();
        const genre = document.getElementById('genre').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const terms = document.getElementById('terms').checked;

        // Validation
        if (!artistName || !email || !genre || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            showError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (!terms) {
            showError('Please accept the Terms of Service and Privacy Policy');
            return;
        }

        // Check if email already exists
        const artists = JSON.parse(localStorage.getItem('artists') || '[]');
        if (artists.some(artist => artist.email === email)) {
            showError('An account with this email already exists');
            return;
        }

        // Create new artist object
        const newArtist = {
            id: Date.now().toString(),
            artistName,
            email,
            genre,
            password: btoa(password), // Basic encoding (not for production use)
            registrationDate: new Date().toISOString(),
            status: 'pending' // Requires manager approval
        };

        // Save to localStorage
        artists.push(newArtist);
        localStorage.setItem('artists', JSON.stringify(artists));

        // Show success message and redirect
        alert('Registration successful! Please wait for manager approval.');
        window.location.href = 'login.html';
    });
}); 