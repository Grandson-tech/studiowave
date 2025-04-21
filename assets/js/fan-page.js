document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const themeToggle = document.getElementById('themeToggle');
    const createPostBtn = document.querySelector('.create-post-btn');
    const createPostModal = document.getElementById('createPostModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const createPostForm = document.getElementById('createPostForm');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchInput = document.querySelector('.search-bar input');
    const notificationBtn = document.querySelector('.notification-btn');
    const likeButtons = document.querySelectorAll('.stat:first-child');
    const commentInputs = document.querySelectorAll('.comment-input input');
    const followButtons = document.querySelectorAll('.follow-btn');
    const unfollowButtons = document.querySelectorAll('.unfollow-btn');
    const rsvpButtons = document.querySelectorAll('.rsvp-btn');
    const shareButtons = document.querySelectorAll('.share-btn');
    const playButtons = document.querySelectorAll('.play-btn');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    // Sidebar Toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Theme Toggle
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Create Post Modal
    createPostBtn.addEventListener('click', () => {
        createPostModal.style.display = 'flex';
    });

    const closeModalFunc = () => {
        createPostModal.style.display = 'none';
    };

    closeModal.addEventListener('click', closeModalFunc);
    cancelBtn.addEventListener('click', closeModalFunc);

    window.addEventListener('click', (e) => {
        if (e.target === createPostModal) {
            closeModalFunc();
        }
    });

    // Create Post Form Submission
    createPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const imageFile = document.getElementById('postImage').files[0];
        const tags = document.getElementById('postTags').value;
        
        // In a real application, you would send this data to a server
        // For now, we'll just log it and close the modal
        console.log('New Post:', { title, content, imageFile, tags });
        
        // Reset form and close modal
        createPostForm.reset();
        closeModalFunc();
        
        // Show success message
        showNotification('Post created successfully!', 'success');
    });

    // Tab Switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Search Functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // In a real application, you would filter content based on the search term
        // For now, we'll just log the search term
        console.log('Searching for:', searchTerm);
    });

    // Like Functionality
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const likeCount = button.querySelector('span');
            const currentCount = parseInt(likeCount.textContent);
            
            if (button.classList.contains('liked')) {
                likeCount.textContent = currentCount - 1;
                button.classList.remove('liked');
                button.querySelector('i').classList.remove('fas');
                button.querySelector('i').classList.add('far');
            } else {
                likeCount.textContent = currentCount + 1;
                button.classList.add('liked');
                button.querySelector('i').classList.remove('far');
                button.querySelector('i').classList.add('fas');
            }
        });
    });

    // Comment Functionality
    commentInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim() !== '') {
                const commentText = input.value.trim();
                const postComments = input.closest('.post-comments').querySelector('.comments-list');
                
                // Create new comment element
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <img src="assets/images/default-avatar.png" alt="Your Avatar">
                    <div class="comment-content">
                        <h4>You</h4>
                        <p>${commentText}</p>
                        <div class="comment-actions">
                            <span>Like</span>
                            <span>Reply</span>
                            <span>Just now</span>
                        </div>
                    </div>
                `;
                
                // Add new comment to the list
                if (postComments) {
                    postComments.appendChild(newComment);
                } else {
                    const newCommentsList = document.createElement('div');
                    newCommentsList.className = 'comments-list';
                    newCommentsList.appendChild(newComment);
                    input.closest('.post-comments').appendChild(newCommentsList);
                }
                
                // Clear input
                input.value = '';
            }
        });
    });

    // Follow/Unfollow Functionality
    followButtons.forEach(button => {
        button.addEventListener('click', () => {
            const artistCard = button.closest('.suggested-artist');
            const artistName = artistCard.querySelector('h4').textContent;
            
            button.textContent = 'Following';
            button.classList.add('following');
            
            showNotification(`You are now following ${artistName}`, 'success');
        });
    });

    unfollowButtons.forEach(button => {
        button.addEventListener('click', () => {
            const artistCard = button.closest('.following-card');
            const artistName = artistCard.querySelector('h3').textContent;
            
            // In a real application, you would remove this card from the DOM
            // For now, we'll just show a notification
            showNotification(`You have unfollowed ${artistName}`, 'info');
        });
    });

    // RSVP Functionality
    rsvpButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventCard = button.closest('.event-card, .event-item');
            const eventName = eventCard.querySelector('h3, h4').textContent;
            
            if (button.textContent === 'RSVP') {
                button.textContent = 'RSVP\'d';
                button.classList.add('rsvpd');
                showNotification(`You have RSVP'd to ${eventName}`, 'success');
            } else {
                button.textContent = 'RSVP';
                button.classList.remove('rsvpd');
                showNotification(`You have cancelled your RSVP to ${eventName}`, 'info');
            }
        });
    });

    // Share Functionality
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventCard = button.closest('.event-card, .event-item');
            const eventName = eventCard.querySelector('h3, h4').textContent;
            
            // In a real application, you would open a share dialog
            // For now, we'll just show a notification
            showNotification(`Sharing ${eventName}`, 'info');
        });
    });

    // Video Play Functionality
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoContainer = button.closest('.video-container');
            const thumbnail = videoContainer.querySelector('.video-thumbnail');
            
            // In a real application, you would play the video
            // For now, we'll just show a notification
            showNotification('Video playback started', 'info');
        });
    });

    // Notification Function
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        
        // Add notification to the DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--card-bg);
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification i {
            font-size: 1.25rem;
        }
        
        .notification.success i {
            color: #4caf50;
        }
        
        .notification.error i {
            color: #f44336;
        }
        
        .notification.info i {
            color: #2196f3;
        }
        
        .stat.liked i {
            color: #f44336;
        }
        
        .follow-btn.following {
            background-color: var(--card-bg);
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }
        
        .rsvp-btn.rsvpd {
            background-color: var(--card-bg);
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }
    `;
    document.head.appendChild(style);
}); 