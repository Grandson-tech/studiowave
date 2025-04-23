// DOM Elements
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const searchInput = document.querySelector('.search-bar input');
const themeToggle = document.querySelector('.theme-toggle');
const notifications = document.querySelector('.notifications');
const logoutBtn = document.querySelector('.logout-btn');
const sections = document.querySelectorAll('.dashboard-section');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

// Sample Data
const sampleArtists = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        genre: 'Hip Hop',
        status: 'Active',
        bookings: 12,
        revenue: 2400,
        hours: 24
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        genre: 'R&B',
        status: 'Active',
        bookings: 8,
        revenue: 1600,
        hours: 16
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        genre: 'Rock',
        status: 'Inactive',
        bookings: 4,
        revenue: 800,
        hours: 8
    }
];

const sampleBookings = [
    {
        id: 1,
        date: '2024-03-15',
        time: '14:00',
        artist: 'John Doe',
        duration: '2h',
        status: 'Confirmed'
    },
    {
        id: 2,
        date: '2024-03-16',
        time: '10:00',
        artist: 'Jane Smith',
        duration: '4h',
        status: 'Pending'
    },
    {
        id: 3,
        date: '2024-03-17',
        time: '16:00',
        artist: 'Mike Johnson',
        duration: '3h',
        status: 'Completed'
    }
];

// Check Authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
    if (!currentUser || currentUser.role !== 'manager') {
        window.location.href = './manager-login.html';
    } else {
        document.getElementById('managerName').textContent = currentUser.name;
    }
}

// Toggle Sidebar
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// Toggle Theme
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Handle Search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const tableRows = document.querySelectorAll('.bookings-list tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Handle Notifications
function handleNotifications() {
    // Placeholder for notification handling
    console.log('Notifications clicked');
}

// Handle Date Filter
function handleDateFilter() {
    // Placeholder for date filter handling
    console.log('Date filter changed');
}

// Add New Artist
function addNewArtist() {
    // Create modal for adding new artist
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Artist</h3>
            <form id="newArtistForm">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" required>
                </div>
                <div class="form-group">
                    <label>Genre</label>
                    <input type="text" required>
                </div>
                <button type="submit">Add Artist</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Save artist data
        const artists = JSON.parse(localStorage.getItem('artists') || '[]');
        artists.push({
            id: Date.now(),
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            genre: form.querySelector('input[type="text"]').value
        });
        localStorage.setItem('artists', JSON.stringify(artists));
        modal.remove();
        loadArtists();
    });
}

// Add New Booking
function addNewBooking() {
    // Create modal for adding new booking
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Booking</h3>
            <form id="newBookingForm">
                <div class="form-group">
                    <label>Artist</label>
                    <select required>
                        <option value="">Select Artist</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" required>
                </div>
                <div class="form-group">
                    <label>Time</label>
                    <input type="time" required>
                </div>
                <div class="form-group">
                    <label>Duration (hours)</label>
                    <input type="number" min="1" max="24" required>
                </div>
                <button type="submit">Add Booking</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Save booking data
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push({
            id: Date.now(),
            artist: form.querySelector('select').value,
            date: form.querySelector('input[type="date"]').value,
            time: form.querySelector('input[type="time"]').value,
            duration: form.querySelector('input[type="number"]').value
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        modal.remove();
        loadBookings();
    });
}

// Load Artists
function loadArtists() {
    const artistsList = document.querySelector('.artists-list');
    const artists = JSON.parse(localStorage.getItem('artists') || '[]');
    
    artistsList.innerHTML = artists.map(artist => `
        <div class="artist-card">
            <h3>${artist.name}</h3>
            <p>${artist.email}</p>
            <p>${artist.genre}</p>
            <div class="actions">
                <button onclick="editArtist(${artist.id})">Edit</button>
                <button onclick="deleteArtist(${artist.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Load Bookings
function loadBookings() {
    const bookingsList = document.querySelector('.bookings-list');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    bookingsList.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.artist}</td>
            <td>${booking.duration}h</td>
            <td>Pending</td>
            <td>
                <button onclick="editBooking(${booking.id})">Edit</button>
                <button onclick="deleteBooking(${booking.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Initialize Charts
function initCharts() {
    // Placeholder for chart initialization
    console.log('Initializing charts...');
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = './manager-login.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadArtists();
    loadBookings();
    initCharts();

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            switchSection(sectionId);
        });
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            switchSection(sectionId);
        });
    });

    // Logout
    logoutBtn.addEventListener('click', handleLogout);
}); 