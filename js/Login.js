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
        // Get registered users from cookies
        const users = VerdraCookies.getUsers();
        
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

        // Store in cookies
        VerdraCookies.setUserSession(sessionData.user, remember);

        // Update user's last login
        const users = VerdraCookies.getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            VerdraCookies.storeUsers(users);
        }
    }

    function checkExistingLogin() {
        // Don't check if we just logged out
        if (document.referrer.includes('Profile.html')) {
            return;
        }

        // Check cookie-based session
        if (VerdraCookies.isSessionValid()) {
            window.location.replace('Profile.html');
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
        // Store user data in cookies
        VerdraCookies.setUserSession(userData, false);
        
        // Store empty arrays for orders and wishlist if they don't exist
        if (!VerdraCookies.getUserData('userOrders')) {
            VerdraCookies.storeUserData('userOrders', [], 30);
        }
        if (!VerdraCookies.getUserData('userWishlist')) {
            VerdraCookies.storeUserData('userWishlist', [], 30);
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
    const existingUsers = VerdraCookies.getUsers();
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
        
        VerdraCookies.storeUsers([demoUserData]);
        
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
        return VerdraCookies.isSessionValid();
    },

    // Get current user data
    getCurrentUser: function() {
        if (!this.isLoggedIn()) return null;
        
        const session = VerdraCookies.getUserSession();
        try {
            return session.user;
        } catch (error) {
            return null;
        }
    },

    // Logout user
    logout: function() {
        VerdraCookies.clearUserSession();
        window.location.href = 'Login.html';
    },

    // Require authentication (redirect to login if not logged in)
    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'Login.html';
        }
    }
};