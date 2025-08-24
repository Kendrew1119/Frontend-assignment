// Login.js - Authentication functionality for Login page

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.querySelector('.login-btn');

    // Check if user is already logged in
    checkExistingLogin();

    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Real-time validation
    usernameInput.addEventListener('input', clearErrorMessage);
    passwordInput.addEventListener('input', clearErrorMessage);

    function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;

        // Validate inputs
        if (!username) {
            showErrorMessage('Please enter your username or email');
            usernameInput.focus();
            return;
        }

        if (!password) {
            showErrorMessage('Please enter your password');
            passwordInput.focus();
            return;
        }

        // Show loading state
        showLoadingState(true);

        // Simulate API call with timeout
        setTimeout(() => {
            const loginResult = authenticateUser(username, password);
            
            if (loginResult.success) {
                // Store login information
                storeUserSession(loginResult.user, remember);
                
                // Show success and redirect
                showSuccessMessage('Login successful! Redirecting...');
                
                setTimeout(() => {
                    handleSuccessfulLogin(loginResult.user);
                }, 1500);
            } else {
                showErrorMessage(loginResult.message);
                showLoadingState(false);
            }
        }, 1500);
    }

    function authenticateUser(username, password) {
        // Get registered users from localStorage
        const users = JSON.parse(localStorage.getItem('verdra_users') || '[]');
        
        // Find user by username or email
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() || 
            u.email.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
            return {
                success: false,
                message: 'User not found. Please check your username or email.'
            };
        }

        if (user.password !== password) {
            return {
                success: false,
                message: 'Incorrect password. Please try again.'
            };
        }

        return {
            success: true,
            user: user
        };
    }

    function storeUserSession(user, remember) {
        const sessionData = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                address: user.address,
                postcode: user.postcode
            },
            loginTime: new Date().toISOString(),
            remember: remember
        };

        if (remember) {
            // Store in localStorage for persistent login
            localStorage.setItem('verdra_session', JSON.stringify(sessionData));
        } else {
            // Store in sessionStorage for session-only login
            sessionStorage.setItem('verdra_session', JSON.stringify(sessionData));
        }

        // Update user's last login
        const users = JSON.parse(localStorage.getItem('verdra_users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            localStorage.setItem('verdra_users', JSON.stringify(users));
        }
    }

    function checkExistingLogin() {
        // Don't check if we just logged out
        if (document.referrer.includes('Profile.html')) {
            return;
        }

        const session = localStorage.getItem('verdra_session') || sessionStorage.getItem('verdra_session');
        
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                
                // Check if session is still valid
                const loginTime = new Date(sessionData.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                const maxHours = sessionData.remember ? 24 * 7 : 1;
                
                if (hoursDiff < maxHours) {
                    window.location.replace('Profile.html');
                } else {
                    // Clear expired session
                    localStorage.removeItem('verdra_session');
                    sessionStorage.clear();
                }
            } catch (error) {
                console.error('Error parsing session data:', error);
                localStorage.removeItem('verdra_session');
                sessionStorage.clear();
            }
        }
    }

    function showLoadingState(loading) {
        if (loading) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    function showErrorMessage(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }

    function showSuccessMessage(message) {
        // Create success message element if it doesn't exist
        let successElement = document.querySelector('.success-message');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'success-message';
            errorMessage.parentNode.insertBefore(successElement, errorMessage.nextSibling);
        }
        
        successElement.textContent = message;
        successElement.style.display = 'block';
        successElement.style.background = 'rgba(56, 161, 105, 0.1)';
        successElement.style.color = 'var(--success-green)';
        successElement.style.borderLeft = '4px solid var(--success-green)';
        successElement.style.padding = '12px 16px';
        successElement.style.borderRadius = '8px';
        successElement.style.fontSize = '0.9rem';
        successElement.style.fontWeight = '600';
        successElement.style.marginBottom = '20px';
        successElement.style.opacity = '1';
        successElement.style.transform = 'translateY(0)';
    }

    function clearErrorMessage() {
        errorMessage.classList.remove('show');
    }

    function handleSuccessfulLogin(userData) {
        // Store user data in session storage
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
        
        // Store empty arrays for orders and wishlist if they don't exist
        if (!sessionStorage.getItem('userOrders')) {
            sessionStorage.setItem('userOrders', JSON.stringify([]));
        }
        if (!sessionStorage.getItem('userWishlist')) {
            sessionStorage.setItem('userWishlist', JSON.stringify([]));
        }

        // Redirect to profile page
        window.location.href = 'Profile.html';
    }

    // Demo credentials helper
    const demoUser = {
        username: 'demo',
        password: 'demo123'
    };

    // Create demo user if no users exist
    const existingUsers = JSON.parse(localStorage.getItem('verdra_users') || '[]');
    if (existingUsers.length === 0) {
        const demoUserData = {
            id: 'demo-user-001',
            username: 'demo',
            email: 'demo@verdra.com',
            password: 'demo123',
            firstName: 'Demo',
            lastName: 'User',
            phone: '+60123456789',
            gender: 'other',
            dateOfBirth: '1990-01-01',
            address: '123 Demo Street, Demo City',
            postcode: '12345',
            newsletter: true,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        localStorage.setItem('verdra_users', JSON.stringify([demoUserData]));
        
        // Show demo credentials hint
        setTimeout(() => {
            const hint = document.createElement('div');
            hint.innerHTML = `
                <div style="background: rgba(74, 124, 89, 0.1); border: 1px solid var(--accent-green); padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; color: var(--accent-green);">
                    <strong>Demo Account:</strong><br>
                    Username: <code style="background: rgba(74, 124, 89, 0.2); padding: 2px 6px; border-radius: 4px;">demo</code><br>
                    Password: <code style="background: rgba(74, 124, 89, 0.2); padding: 2px 6px; border-radius: 4px;">demo123</code>
                </div>
            `;
            loginForm.insertBefore(hint.firstElementChild, loginForm.firstElementChild);
        }, 1000);
    }
});

// Global utility functions for session management
window.VerdraAuth = {
    // Check if user is logged in
    isLoggedIn: function() {
        const session = localStorage.getItem('verdra_session') || sessionStorage.getItem('verdra_session');
        
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            const maxHours = sessionData.remember ? 24 * 7 : 1;
            
            return hoursDiff < maxHours;
        } catch (error) {
            return false;
        }
    },

    // Get current user data
    getCurrentUser: function() {
        if (!this.isLoggedIn()) return null;
        
        const session = localStorage.getItem('verdra_session') || sessionStorage.getItem('verdra_session');
        try {
            return JSON.parse(session).user;
        } catch (error) {
            return null;
        }
    },

    // Logout user
    logout: function() {
        localStorage.removeItem('verdra_session');
        sessionStorage.removeItem('verdra_session');
        window.location.href = 'Login.html';
    },

    // Require authentication (redirect to login if not logged in)
    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'Login.html';
        }
    }
};