// Check Authentication
function checkAuth() {
    const session = JSON.parse(localStorage.getItem('managerSession') || sessionStorage.getItem('managerSession') || '{}');
    
    if (!session.isAuthenticated) {
        window.location.href = 'login.html';
        return null;
    }
    
    return session;
}

// Update UI with Manager Info
function updateManagerUI(session) {
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.querySelector('h3').textContent = session.name;
        userInfo.querySelector('p').textContent = session.isAdmin ? 'Admin Manager' : 'Studio Manager';
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('managerSession');
    sessionStorage.removeItem('managerSession');
    window.location.href = 'login.html';
}

// Add New Manager (Admin Only)
function showAddManagerModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Manager</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="addManagerForm" class="modal-form">
                <div class="form-group">
                    <label for="managerName">Name</label>
                    <input type="text" id="managerName" required>
                </div>
                <div class="form-group">
                    <label for="managerEmail">Email</label>
                    <input type="email" id="managerEmail" required>
                </div>
                <div class="form-group">
                    <label for="managerPassword">Password</label>
                    <input type="password" id="managerPassword" required>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isAdmin">
                        Grant Admin Privileges
                    </label>
                </div>
                <button type="submit" class="btn btn-primary">Add Manager</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Close Modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.remove();

    // Handle Click Outside
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    // Handle Form Submit
    const form = modal.querySelector('#addManagerForm');
    form.onsubmit = (e) => {
        e.preventDefault();

        const newManager = {
            name: form.managerName.value.trim(),
            email: form.managerEmail.value.trim(),
            password: form.managerPassword.value,
            role: 'manager',
            isAdmin: form.isAdmin.checked
        };

        // Get existing managers
        const managers = JSON.parse(localStorage.getItem('managers') || '[]');

        // Check if email already exists
        if (managers.some(m => m.email === newManager.email)) {
            alert('A manager with this email already exists.');
            return;
        }

        // Add new manager
        managers.push(newManager);
        localStorage.setItem('managers', JSON.stringify(managers));

        modal.remove();
        alert('Manager added successfully!');
    };
}

// DOM Elements
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const notifications = document.querySelector('.notifications');
const logoutBtn = document.querySelector('.sidebar-footer a');

// Toggle Sidebar
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
}

// Initialize Tooltips for collapsed sidebar
function initTooltips() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        const text = link.textContent.trim();
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
                    <p>New booking request from Sarah Johnson</p>
                    <span class="notification-time">5 minutes ago</span>
                </div>
            </div>
            <div class="notification-item unread">
                <div class="notification-icon">
                    <i class="fas fa-comment"></i>
                </div>
                <div class="notification-content">
                    <p>Mike Smith left a comment on the session</p>
                    <span class="notification-time">1 hour ago</span>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="notification-content">
                    <p>New artist registration: The Groove Band</p>
                    <span class="notification-time">2 hours ago</span>
                </div>
            </div>
        </div>
        <div class="notifications-footer">
            <a href="#notifications">View all notifications</a>
        </div>
    `;
    return dropdown;
}

// Toggle Notifications Dropdown
function toggleNotifications(e) {
    e.stopPropagation();
    const existingDropdown = document.querySelector('.notifications-dropdown');
    
    if (existingDropdown) {
        existingDropdown.remove();
    } else {
        const dropdown = createNotificationsDropdown();
        notifications.appendChild(dropdown);
    }
}

// Close notifications dropdown when clicking outside
function handleClickOutside(e) {
    const dropdown = document.querySelector('.notifications-dropdown');
    if (dropdown && !notifications.contains(e.target)) {
        dropdown.remove();
    }
}

// Quick Actions Handlers
function initQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    const session = checkAuth();
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.querySelector('span').textContent;
            if (action === 'Add Manager' && !session.isAdmin) {
                alert('Only admin managers can add new managers.');
                return;
            }
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    switch(action) {
        case 'Add Manager':
            showAddManagerModal();
            break;
        case 'Add Booking':
            console.log('Opening booking modal...');
            break;
        case 'Add Artist':
            console.log('Opening artist modal...');
            break;
        case 'Send Announcement':
            console.log('Opening announcement modal...');
            break;
        case 'Generate Invoice':
            console.log('Opening invoice modal...');
            break;
    }
}

// Table Actions
function initTableActions() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.querySelector('i').classList.contains('fa-edit') ? 'edit' : 'delete';
            const row = btn.closest('tr');
            handleTableAction(action, row);
        });
    });
}

function handleTableAction(action, row) {
    const sessionData = {
        time: row.cells[0].textContent,
        artist: row.cells[1].textContent,
        room: row.cells[2].textContent,
        producer: row.cells[3].textContent,
        status: row.cells[4].querySelector('.status-badge').textContent
    };

    if (action === 'edit') {
        console.log('Editing session:', sessionData);
    } else {
        if (confirm(`Are you sure you want to delete the session with ${sessionData.artist}?`)) {
            row.remove();
        }
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

// Event Listeners
sidebarToggle.addEventListener('click', toggleSidebar);
notifications.addEventListener('click', toggleNotifications);
document.addEventListener('click', handleClickOutside);
logoutBtn.addEventListener('click', handleLogout);

// Initialize Features
document.addEventListener('DOMContentLoaded', () => {
    const session = checkAuth();
    if (session) {
        updateManagerUI(session);
        initTooltips();
        initQuickActions();
        initTableActions();
        initSearch();
    }
}); 