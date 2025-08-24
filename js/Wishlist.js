let wishlistItems = [];

// Load wishlist items from localStorage
function loadWishlist() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
        wishlistItems = JSON.parse(saved);
        updateWishlistDisplay();
    }
}

// Add to wishlist
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!wishlistItems.find(item => item.id === productId)) {
        wishlistItems.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        updateWishlistDisplay();
    }
}

// Remove from wishlist
function removeFromWishlist(productId) {
    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    updateWishlistDisplay();
}

// Clear wishlist
function clearWishlist() {
    if (wishlistItems.length > 0 && confirm('Are you sure you want to clear your wishlist?')) {
        wishlistItems = [];
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        updateWishlistDisplay();
    }
}

// Update wishlist display
function updateWishlistDisplay() {
    const wishlistContainer = document.getElementById('wishlistItems');
    
    if (wishlistItems.length === 0) {
        wishlistContainer.innerHTML = '<div class="empty-cart">Your wishlist is empty. Start adding your favorite items!</div>';
        return;
    }

    wishlistContainer.innerHTML = wishlistItems.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <div class="item-icon">${item.icon || '🌿'}</div>
                <div>
                    <h4>${item.name}</h4>
                    <div class="item-price">RM${item.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="item-actions">
                <button class="add-to-cart" onclick="moveToCart(${item.id})">Add to Cart</button>
                <button class="remove-item" onclick="removeFromWishlist(${item.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Move item to cart
function moveToCart(productId) {
    addToCart(productId);
    removeFromWishlist(productId);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
});