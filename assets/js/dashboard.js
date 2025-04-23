// DOM Elements
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const mainContent = document.querySelector('.main-content');
const themeToggle = document.querySelector('.theme-toggle');
const logoutBtn = document.querySelector('.logout-btn');
const searchInput = document.querySelector('.search-bar input');
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
    const currentManager = localStorage.getItem('currentManager');
    if (!currentManager) {
        window.location.href = 'manager-login.html';
    } else {
        const manager = JSON.parse(currentManager);
        document.getElementById('managerName').textContent = manager.name;
    }
}

// Toggle Sidebar
function toggleSidebar() {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('sidebar-active');
}

// Toggle Theme
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Handle Search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Switch Section
function switchSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.parentElement.classList.add('active');
        }
    });

    mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Load Artists
function loadArtists() {
    const artistsList = document.querySelector('.artists-list');
    artistsList.innerHTML = '';

    sampleArtists.forEach(artist => {
        const artistCard = document.createElement('div');
        artistCard.className = 'artist-card';
        artistCard.innerHTML = `
            <div class="artist-info">
                <h3>${artist.name}</h3>
                <p>${artist.email}</p>
                <p>Genre: ${artist.genre}</p>
                <p>Status: <span class="status-badge ${artist.status.toLowerCase()}">${artist.status}</span></p>
            </div>
            <div class="artist-stats">
                <div class="stat">
                    <span>Bookings</span>
                    <strong>${artist.bookings}</strong>
                </div>
                <div class="stat">
                    <span>Revenue</span>
                    <strong>$${artist.revenue}</strong>
                </div>
                <div class="stat">
                    <span>Hours</span>
                    <strong>${artist.hours}h</strong>
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn edit" data-id="${artist.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" data-id="${artist.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        artistsList.appendChild(artistCard);
    });
}

// Load Bookings
function loadBookings() {
    const bookingsList = document.querySelectorAll('.bookings-list');
    
    bookingsList.forEach(list => {
        list.innerHTML = '';
        sampleBookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.artist}</td>
                <td>${booking.duration}</td>
                <td><span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" data-id="${booking.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-id="${booking.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            list.appendChild(row);
        });
    });
}

// Initialize Charts
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [1200, 1900, 1500, 2000, 1800, 2400],
                borderColor: '#4a90e2',
                tension: 0.1
            }]
        }
    });

    // Utilization Chart
    const utilizationCtx = document.getElementById('utilizationChart').getContext('2d');
    new Chart(utilizationCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Hours',
                data: [8, 6, 10, 8, 12, 4, 2],
                backgroundColor: '#4a90e2'
            }]
        }
    });

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['John Doe', 'Jane Smith', 'Mike Johnson'],
            datasets: [{
                data: [40, 30, 30],
                backgroundColor: ['#4a90e2', '#2ecc71', '#e74c3c']
            }]
        }
    });
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('currentManager');
    window.location.href = 'manager-login.html';
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