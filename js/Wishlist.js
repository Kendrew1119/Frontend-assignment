document.addEventListener('DOMContentLoaded', () => {
    if (!VerdraAuth.requireAuth()) return;

    loadWishlistItems();
    displayWishlistItems();
});

let wishlistItems = [];

function loadWishlistItems() {
    wishlistItems = VerdraAuth.getUserWishlist();
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
                <div class="wishlist-item" data-id="${item.id}" onclick="navigateToProduct(${item.id})">
                    <div class="wishlist-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="wishlist-item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">RM${item.price.toFixed(2)}</p>
                        <div class="item-actions">
                            <button class="move-to-cart" onclick="moveToCartClick(event, ${item.id})">
                                Add to Cart
                            </button>
                            <button class="remove-from-wishlist" onclick="removeFromWishlistClick(event, ${item.id})">
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
    if (VerdraAuth.addToUserWishlist(product)) {
        loadWishlistItems();
        displayWishlistItems();
    }
}

function removeFromWishlist(productId) {
    VerdraAuth.removeFromUserWishlist(productId);
    loadWishlistItems();
    displayWishlistItems();
}

function clearWishlist() {
    if (confirm('Are you sure you want to clear your wishlist?')) {
        VerdraAuth.setUserWishlist([]);
        loadWishlistItems();
        displayWishlistItems();
    }
}

function moveToCart(productId) {
    const item = wishlistItems.find(item => item.id === productId);
    if (item) {
        VerdraAuth.addToUserCart(item);
        VerdraAuth.removeFromUserWishlist(productId);
        loadWishlistItems();
        displayWishlistItems();
        showAlert('Item moved to cart!', 'success');
    }
}

// Click-safe wrappers to stop navigation when clicking buttons
function moveToCartClick(event, productId) {
    event.stopPropagation();
    moveToCart(productId);
}

function removeFromWishlistClick(event, productId) {
    event.stopPropagation();
    removeFromWishlist(productId);
}

function navigateToProduct(productId) {
    window.location.href = `Product.html?id=${productId}`;
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Style the alert
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            alertDiv.style.backgroundColor = '#10b981';
            break;
        case 'error':
            alertDiv.style.backgroundColor = '#ef4444';
            break;
        case 'info':
            alertDiv.style.backgroundColor = '#3b82f6';
            break;
        default:
            alertDiv.style.backgroundColor = '#6b7280';
    }
    
    document.body.appendChild(alertDiv);
    
    // Animate in
    setTimeout(() => {
        alertDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alertDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, 3000);
}