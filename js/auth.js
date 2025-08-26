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
    },

    // User-specific storage functions
    getUserStorageKey: function(key) {
        const user = this.getCurrentUser();
        if (!user) return null;
        return `${key}_${user.id}`;
    },

    getUserWishlist: function() {
        const storageKey = this.getUserStorageKey('wishlistItems');
        if (!storageKey) return [];
        const savedWishlist = localStorage.getItem(storageKey);
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    },

    setUserWishlist: function(wishlist) {
        const storageKey = this.getUserStorageKey('wishlistItems');
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(wishlist));
        }
    },

    getUserCart: function() {
        const storageKey = this.getUserStorageKey('cartItems');
        if (!storageKey) return [];
        const savedCart = localStorage.getItem(storageKey);
        return savedCart ? JSON.parse(savedCart) : [];
    },

    setUserCart: function(cart) {
        const storageKey = this.getUserStorageKey('cartItems');
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(cart));
        }
    },

    addToUserWishlist: function(product) {
        const wishlist = this.getUserWishlist();
        if (!wishlist.find(item => item.id === product.id)) {
            wishlist.push(product);
            this.setUserWishlist(wishlist);
            return true;
        }
        return false;
    },

    removeFromUserWishlist: function(productId) {
        const wishlist = this.getUserWishlist();
        const updatedWishlist = wishlist.filter(item => item.id !== productId);
        this.setUserWishlist(updatedWishlist);
    },

    addToUserCart: function(product) {
        const cart = this.getUserCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        this.setUserCart(cart);
        return true;
    },

    removeFromUserCart: function(productId) {
        const cart = this.getUserCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        this.setUserCart(updatedCart);
    },

    updateUserCartQuantity: function(productId, quantity) {
        const cart = this.getUserCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeFromUserCart(productId);
            } else {
                this.setUserCart(cart);
            }
        }
    }
};