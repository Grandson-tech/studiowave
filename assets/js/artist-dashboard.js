// Check Authentication
function checkAuth() {
    const session = JSON.parse(localStorage.getItem('artistSession') || sessionStorage.getItem('artistSession') || '{}');
    
    if (!session.isAuthenticated) {
        window.location.href = 'artist-login.html';
        return null;
    }
    
    return session;
}

// Update UI with Artist Info
function updateArtistUI(session) {
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.querySelector('h3').textContent = session.name;
        userInfo.querySelector('p').textContent = session.genre || 'Artist';
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('artistSession');
    sessionStorage.removeItem('artistSession');
    window.location.href = 'artist-login.html';
}

// Toggle Sidebar
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
}

// Initialize Tooltips
function initTooltips() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        const text = link.querySelector('span').textContent.trim();
        link.setAttribute('title', text);
    });
}

// Notifications Dropdown
function createNotificationsDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'notifications-dropdown';
    dropdown.innerHTML = `
        <div class="notifications-header">
            <h3>Notifications</h3>
            <button class="mark-all-read">Mark all as read</button>
        </div>
        <div class="notifications-list">
            <div class="notification-item unread">
                <div class="notification-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="notification-content">
                    <p>Your session tomorrow at 10:00 AM is confirmed</p>
                    <span class="notification-time">1 hour ago</span>
                </div>
            </div>
            <div class="notification-item unread">
                <div class="notification-icon">
                    <i class="fas fa-comment"></i>
                </div>
                <div class="notification-content">
                    <p>New comment from Producer Mike on your track</p>
                    <span class="notification-time">3 hours ago</span>
                </div>
            </div>
        </div>
        <div class="notifications-footer">
            <a href="#notifications">View all notifications</a>
        </div>
    `;
    return dropdown;
}

// Toggle Notifications
function toggleNotifications(e) {
    e.stopPropagation();
    const existingDropdown = document.querySelector('.notifications-dropdown');
    
    if (existingDropdown) {
        existingDropdown.remove();
    } else {
        const dropdown = createNotificationsDropdown();
        document.querySelector('.notifications').appendChild(dropdown);
    }
}

// Close notifications when clicking outside
function handleClickOutside(e) {
    const dropdown = document.querySelector('.notifications-dropdown');
    if (dropdown && !document.querySelector('.notifications').contains(e.target)) {
        dropdown.remove();
    }
}

// Handle Session Actions
function initSessionActions() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.querySelector('i').classList.contains('fa-edit') ? 'edit' : 'cancel';
            const row = btn.closest('tr');
            handleSessionAction(action, row);
        });
    });
}

function handleSessionAction(action, row) {
    const sessionData = {
        dateTime: row.cells[0].textContent,
        studio: row.cells[1].textContent,
        producer: row.cells[2].textContent,
        project: row.cells[3].textContent,
        status: row.cells[4].querySelector('.status-badge').textContent
    };

    if (action === 'edit') {
        // Implement edit session modal
        console.log('Editing session:', sessionData);
    } else {
        if (confirm(`Are you sure you want to cancel the session on ${sessionData.dateTime}?`)) {
            row.remove();
        }
    }
}

// Quick Actions
function initQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.querySelector('span').textContent;
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    switch(action) {
        case 'Book Session':
            console.log('Opening booking modal...');
            break;
        case 'New Project':
            console.log('Opening new project modal...');
            break;
        case 'Add Collaborator':
            console.log('Opening collaborator modal...');
            break;
        case 'Upload Track':
            console.log('Opening upload modal...');
            break;
        case 'Message Producer':
            console.log('Opening messaging interface...');
            break;
    }
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tableRows = document.querySelectorAll('tbody tr');
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Event Listeners
document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
document.querySelector('.notifications').addEventListener('click', toggleNotifications);
document.addEventListener('click', handleClickOutside);
document.getElementById('logout-btn').addEventListener('click', handleLogout);

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    const session = checkAuth();
    if (session) {
        updateArtistUI(session);
        initTooltips();
        initSessionActions();
        initQuickActions();
        initSearch();
        initThemeToggle();
    }
}); 