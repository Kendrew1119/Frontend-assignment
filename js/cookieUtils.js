// Cookie utility functions for Verdra authentication system

const VerdraCookies = {
    // Set a cookie with optional expiration
    setCookie: function(name, value, days = 30, path = '/') {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=' + path;
    },

    // Get a cookie value by name
    getCookie: function(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    },

    // Delete a cookie
    deleteCookie: function(name, path = '/') {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=' + path;
    },

    // Check if cookies are enabled
    areCookiesEnabled: function() {
        try {
            this.setCookie('test', 'test', 1);
            const enabled = this.getCookie('test') === 'test';
            this.deleteCookie('test');
            return enabled;
        } catch (e) {
            return false;
        }
    },

    // Set user session cookie
    setUserSession: function(userData, remember = false) {
        const sessionData = {
            user: userData,
            loginTime: new Date().toISOString(),
            remember: remember
        };
        
        const expirationDays = remember ? 30 : 1; // 30 days for remember me, 1 day for session
        this.setCookie('verdra_session', JSON.stringify(sessionData), expirationDays);
    },

    // Get user session from cookie
    getUserSession: function() {
        const sessionCookie = this.getCookie('verdra_session');
        if (!sessionCookie) return null;
        
        try {
            return JSON.parse(sessionCookie);
        } catch (e) {
            console.error('Error parsing session cookie:', e);
            this.deleteCookie('verdra_session');
            return null;
        }
    },

    // Check if user session is valid
    isSessionValid: function() {
        const session = this.getUserSession();
        if (!session) return false;
        
        try {
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            const maxHours = session.remember ? 24 * 30 : 24; // 30 days or 1 day
            
            if (hoursDiff >= maxHours) {
                this.deleteCookie('verdra_session');
                return false;
            }
            
            return true;
        } catch (e) {
            this.deleteCookie('verdra_session');
            return false;
        }
    },

    // Clear user session
    clearUserSession: function() {
        this.deleteCookie('verdra_session');
    },

    // Store user data in cookies
    storeUserData: function(key, data, days = 30) {
        this.setCookie(`verdra_${key}`, JSON.stringify(data), days);
    },

    // Get user data from cookies
    getUserData: function(key) {
        const data = this.getCookie(`verdra_${key}`);
        if (!data) return null;
        
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error(`Error parsing ${key} data:`, e);
            this.deleteCookie(`verdra_${key}`);
            return null;
        }
    },

    // Store users array (for registration)
    storeUsers: function(users) {
        this.setCookie('verdra_users', JSON.stringify(users), 365); // Store for 1 year
    },

    // Get users array
    getUsers: function() {
        const users = this.getCookie('verdra_users');
        if (!users) return [];
        
        try {
            return JSON.parse(users);
        } catch (e) {
            console.error('Error parsing users data:', e);
            this.deleteCookie('verdra_users');
            return [];
        }
    },

    // Add user to users array
    addUser: function(user) {
        const users = this.getUsers();
        users.push(user);
        this.storeUsers(users);
    },

    // Find user by username or email
    findUser: function(usernameOrEmail) {
        const users = this.getUsers();
        return users.find(u => 
            u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
            u.email.toLowerCase() === usernameOrEmail.toLowerCase()
        );
    },

    // Update user data
    updateUser: function(userId, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            this.storeUsers(users);
            return true;
        }
        return false;
    }
};

// Cookie consent management
const CookieConsent = {
    // Check if user has given consent
    hasConsent: function() {
        return this.getCookie('verdra_cookie_consent') === 'accepted';
    },

    // Set cookie consent
    setConsent: function(accepted) {
        if (accepted) {
            this.setCookie('verdra_cookie_consent', 'accepted', 365);
        } else {
            this.setCookie('verdra_cookie_consent', 'declined', 365);
        }
    },

    // Show cookie consent banner
    showBanner: function() {
        if (this.hasConsent()) return;
        
        const banner = document.createElement('div');
        banner.id = 'cookieConsentBanner';
        banner.innerHTML = `
            <div class="cookie-consent-banner">
                <div class="cookie-content">
                    <div class="cookie-text">
                        <h4>🍪 We use cookies to enhance your experience</h4>
                        <p>We use cookies to remember your preferences, analyze site traffic, and provide personalized content. By continuing to use our site, you consent to our use of cookies.</p>
                    </div>
                    <div class="cookie-buttons">
                        <button class="cookie-accept" onclick="CookieConsent.accept()">Accept All</button>
                        <button class="cookie-decline" onclick="CookieConsent.decline()">Decline</button>
                        <a href="#" class="cookie-learn-more">Learn More</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Add CSS for the banner
        if (!document.getElementById('cookieConsentCSS')) {
            const style = document.createElement('style');
            style.id = 'cookieConsentCSS';
            style.textContent = `
                .cookie-consent-banner {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(45, 80, 22, 0.2);
                    padding: 20px;
                    z-index: 9999;
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
                    animation: slideUp 0.3s ease-out;
                }
                
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                
                .cookie-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }
                
                .cookie-text h4 {
                    margin: 0 0 8px 0;
                    color: var(--primary-green, #2d5016);
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                
                .cookie-text p {
                    margin: 0;
                    color: var(--text-color, #333);
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                
                .cookie-buttons {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    flex-shrink: 0;
                }
                
                .cookie-accept {
                    background: var(--primary-green, #2d5016);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .cookie-accept:hover {
                    background: var(--accent-green, #4a7c59);
                }
                
                .cookie-decline {
                    background: transparent;
                    color: var(--text-color, #333);
                    border: 1px solid rgba(45, 80, 22, 0.3);
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .cookie-decline:hover {
                    background: rgba(45, 80, 22, 0.1);
                    border-color: var(--primary-green, #2d5016);
                }
                
                .cookie-learn-more {
                    color: var(--primary-green, #2d5016);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                
                .cookie-learn-more:hover {
                    text-decoration: underline;
                }
                
                @media (max-width: 768px) {
                    .cookie-content {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .cookie-buttons {
                        flex-direction: column;
                        width: 100%;
                    }
                    
                    .cookie-accept,
                    .cookie-decline {
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    // Accept cookies
    accept: function() {
        this.setConsent(true);
        this.hideBanner();
    },

    // Decline cookies
    decline: function() {
        this.setConsent(false);
        this.hideBanner();
    },

    // Hide cookie banner
    hideBanner: function() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease-in';
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 300);
        }
    },

    // Initialize cookie consent
    init: function() {
        if (!this.hasConsent()) {
            this.showBanner();
        }
    }
};

// Extend CookieConsent with cookie methods
Object.assign(CookieConsent, VerdraCookies);

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CookieConsent.init();
});

// Export for use in other files
window.VerdraCookies = VerdraCookies;
window.CookieConsent = CookieConsent;
