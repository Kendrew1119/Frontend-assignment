const VerdraAuth = {
    isLoggedIn: function() {
        const user = this.getCurrentUser();
        return !!user;
    },

    getCurrentUser: function() {
        // Check both sessionStorage and localStorage
        const sessionUser = sessionStorage.getItem('loggedInUser');
        const localUser = localStorage.getItem('loggedInUser');
        return sessionUser ? JSON.parse(sessionUser) : (localUser ? JSON.parse(localUser) : null);
    },

    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }
        return true;
    },

    setCurrentUser: function(user, remember = false) {
        const userData = JSON.stringify(user);
        if (remember) {
            localStorage.setItem('loggedInUser', userData);
        }
        sessionStorage.setItem('loggedInUser', userData);
    },

    logout: function() {
        sessionStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUser');
        window.location.href = 'Login.html';
    }
};