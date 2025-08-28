const VerdraAuth = {
    isLoggedIn: function() {
        const user = this.getCurrentUser();
        return !!user;
    },

    getCurrentUser: function() {
        // Check cookie-based session
        if (typeof VerdraCookies !== 'undefined' && VerdraCookies.isSessionValid()) {
            const session = VerdraCookies.getUserSession();
            return session ? session.user : null;
        }
        return null;
    },

    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }
        return true;
    },

    setCurrentUser: function(user, remember = false) {
        if (typeof VerdraCookies !== 'undefined') {
            VerdraCookies.setUserSession(user, remember);
        }
    },

    logout: function() {
        if (typeof VerdraCookies !== 'undefined') {
            VerdraCookies.clearUserSession();
        }
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
        
        if (typeof VerdraCookies !== 'undefined') {
            const savedWishlist = VerdraCookies.getUserData(storageKey);
            return savedWishlist || [];
        }
        return [];
    },

    setUserWishlist: function(wishlist) {
        const storageKey = this.getUserStorageKey('wishlistItems');
        if (storageKey && typeof VerdraCookies !== 'undefined') {
            VerdraCookies.storeUserData(storageKey, wishlist, 30);
        }
    },

    getUserCart: function() {
        const storageKey = this.getUserStorageKey('cartItems');
        if (!storageKey) return [];
        
        if (typeof VerdraCookies !== 'undefined') {
            const savedCart = VerdraCookies.getUserData(storageKey);
            return savedCart || [];
        }
        return [];
    },

    setUserCart: function(cart) {
        const storageKey = this.getUserStorageKey('cartItems');
        if (storageKey && typeof VerdraCookies !== 'undefined') {
            VerdraCookies.storeUserData(storageKey, cart, 30);
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