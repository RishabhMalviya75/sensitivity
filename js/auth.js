// SensiFinder - Authentication System
// Uses localStorage for demo purposes (not for production use)

const AUTH_KEY = 'sensifinder_auth';
const USERS_KEY = 'sensifinder_users';

// Get current user
function getCurrentUser() {
    const authData = localStorage.getItem(AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Get all registered users
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Save users
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Sign up new user
function signUp(username, email, password) {
    const users = getUsers();

    // Check if username exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, error: 'Username already exists' };
    }

    // Check if email exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        username: username,
        email: email,
        password: password, // In production, this would be hashed!
        createdAt: new Date().toISOString(),
        likedProfiles: [],
        uploadedProfiles: []
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after signup
    login(username, password);

    return { success: true, user: newUser };
}

// Login user
function login(username, password) {
    const users = getUsers();
    const user = users.find(u =>
        (u.username.toLowerCase() === username.toLowerCase() ||
            u.email.toLowerCase() === username.toLowerCase()) &&
        u.password === password
    );

    if (user) {
        // Store auth session (without password)
        const sessionUser = { ...user };
        delete sessionUser.password;
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
    }

    return { success: false, error: 'Invalid username or password' };
}

// Logout user
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
}

// Update user data
function updateUserData(updates) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        saveUsers(users);

        // Update session
        const sessionUser = { ...users[userIndex] };
        delete sessionUser.password;
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));

        return true;
    }

    return false;
}

// Like/unlike a profile
function toggleLike(profileId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return { success: false, error: 'Please login to like profiles' };
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) return { success: false, error: 'User not found' };

    const likedProfiles = users[userIndex].likedProfiles || [];
    const isLiked = likedProfiles.includes(profileId);

    if (isLiked) {
        // Unlike
        users[userIndex].likedProfiles = likedProfiles.filter(id => id !== profileId);
    } else {
        // Like
        users[userIndex].likedProfiles = [...likedProfiles, profileId];
    }

    saveUsers(users);

    // Update session
    const sessionUser = { ...users[userIndex] };
    delete sessionUser.password;
    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));

    // Update profile upvotes
    updateProfileUpvotes(profileId, isLiked ? -1 : 1);

    return { success: true, isLiked: !isLiked };
}

// Check if user has liked a profile
function hasLiked(profileId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    return (currentUser.likedProfiles || []).includes(profileId);
}

// Update profile upvotes (for user-uploaded profiles)
function updateProfileUpvotes(profileId, change) {
    const userProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const profileIndex = userProfiles.findIndex(p => p.id === profileId);

    if (profileIndex !== -1) {
        userProfiles[profileIndex].upvotes = Math.max(0, (userProfiles[profileIndex].upvotes || 0) + change);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfiles));
    }

    // For mock profiles, we track likes in a separate storage
    const mockLikes = JSON.parse(localStorage.getItem('sensifinder_mock_likes') || '{}');
    mockLikes[profileId] = (mockLikes[profileId] || 0) + change;
    localStorage.setItem('sensifinder_mock_likes', JSON.stringify(mockLikes));
}

// Get adjusted upvotes (mock + user likes)
function getAdjustedUpvotes(profile) {
    const mockLikes = JSON.parse(localStorage.getItem('sensifinder_mock_likes') || '{}');
    return profile.upvotes + (mockLikes[profile.id] || 0);
}

// Update navbar based on auth state
function updateNavbarAuth() {
    const authContainer = document.getElementById('auth-buttons');
    const mobileAuthContainer = document.getElementById('mobile-auth-buttons');

    if (!authContainer) return;

    const user = getCurrentUser();

    if (user) {
        const authHTML = `
            <div class="user-menu">
                <button class="user-avatar" id="user-menu-toggle">
                    <span>${user.username.charAt(0).toUpperCase()}</span>
                </button>
                <div class="user-dropdown" id="user-dropdown">
                    <div class="user-dropdown-header">
                        <span class="user-dropdown-name">${user.username}</span>
                        <span class="user-dropdown-email">${user.email}</span>
                    </div>
                    <div class="user-dropdown-divider"></div>
                    <a href="upload.html" class="user-dropdown-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Upload Sensitivity
                    </a>
                    <button class="user-dropdown-item" onclick="logout()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Logout
                    </button>
                </div>
            </div>
        `;
        authContainer.innerHTML = authHTML;
        if (mobileAuthContainer) {
            mobileAuthContainer.innerHTML = `
                <a href="upload.html" class="nav-link">Upload</a>
                <button class="nav-link" onclick="logout()">Logout</button>
            `;
        }

        // Setup dropdown toggle
        setTimeout(() => {
            const toggle = document.getElementById('user-menu-toggle');
            const dropdown = document.getElementById('user-dropdown');

            if (toggle && dropdown) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });

                document.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                });
            }
        }, 100);
    } else {
        authContainer.innerHTML = `
            <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
            <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
        `;
        if (mobileAuthContainer) {
            mobileAuthContainer.innerHTML = `
                <a href="login.html" class="nav-link">Login</a>
                <a href="signup.html" class="nav-link">Sign Up</a>
            `;
        }
    }
}

// Protect page for authenticated users only
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return false;
    }
    return true;
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarAuth();
});
