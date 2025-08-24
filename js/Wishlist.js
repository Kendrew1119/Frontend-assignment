document.addEventListener('DOMContentLoaded', () => {
    if (!VerdraAuth.requireAuth()) return;

    loadWishlistItems();
    displayWishlistItems();
});

let wishlistItems = [];

function loadWishlistItems() {
    const savedWishlist = localStorage.getItem('wishlistItems');
    if (savedWishlist) {
        wishlistItems = JSON.parse(savedWishlist);
    }
}

function displayWishlistItems() {
    const container = document.querySelector('.WishlistContent');
    if (!container) return;

    if (wishlistItems.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M12 21C12 21 4 13.667 4 8.5C4 5.462 6.462 3 9.5 3C11.24 3 12.91 4.058 13.5 5.355C14.09 4.058 15.76 3 17.5 3C20.538 3 23 5.462 23 8.5C23 13.667 15 21 15 21H12Z"/>
                </svg>
                <h2>Your wishlist is empty</h2>
                <p>Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
                <button class="continue-shopping" onclick="window.location.href='Home.html'">Continue Shopping</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="wishlist-header">
            <h1>My Wishlist</h1>
            <button class="clear-wishlist" onclick="clearWishlist()">Clear All</button>
        </div>
        <div class="wishlist-grid">
            ${wishlistItems.map(item => `
                <div class="wishlist-item" data-id="${item.id}">
                    <div class="wishlist-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="wishlist-item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">RM${item.price.toFixed(2)}</p>
                        <div class="item-actions">
                            <button class="move-to-cart" onclick="moveToCart(${item.id})">
                                Add to Cart
                            </button>
                            <button class="remove-from-wishlist" onclick="removeFromWishlist(${item.id})">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function addToWishlist(product) {
    if (!wishlistItems.find(item => item.id === product.id)) {
        wishlistItems.push(product);
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        displayWishlistItems();
    }
}

function removeFromWishlist(productId) {
    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    displayWishlistItems();
}

function clearWishlist() {
    if (confirm('Are you sure you want to clear your wishlist?')) {
        wishlistItems = [];
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        displayWishlistItems();
    }
}

function moveToCart(productId) {
    const item = wishlistItems.find(item => item.id === productId);
    if (item) {
        addToCart(item);
        removeFromWishlist(productId);
    }
}