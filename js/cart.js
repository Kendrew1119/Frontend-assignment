// Cart state
let cartItems = [];

// Load cart items from user-specific storage
function loadCartItems() {
    cartItems = VerdraAuth.getUserCart();
}

// Save cart items to user-specific storage
function saveCartItems() {
    VerdraAuth.setUserCart(cartItems);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <svg width="64" height="64" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
                    <circle r="1" cy="21" cx="9"></circle>
                    <circle r="1" cy="21" cx="20"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <h2>Your cart is empty</h2>
                <p>Add items to your cart. Review them anytime and easily checkout.</p>
                <button class="continue-shopping" onclick="window.location.href='index.html'">Continue Shopping</button>
            </div>
        `;
        if (cartTotal) cartTotal.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}" onclick="navigateToProduct(${item.id})">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="item-price">RM${item.price.toFixed(2)}</p>
                <div class="quantity-controls" onclick="event.stopPropagation()">
                    <button onclick="quantityMinus(event, ${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="quantityPlus(event, ${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeItemClick(event, ${item.id})">×</button>
        </div>
    `).join('');

    updateCartTotal();
}

function quantityMinus(event, productId, newQuantity) {
    event.stopPropagation();
    updateQuantity(productId, newQuantity);
}

function quantityPlus(event, productId, newQuantity) {
    event.stopPropagation();
    updateQuantity(productId, newQuantity);
}

function removeItemClick(event, productId) {
    event.stopPropagation();
    removeFromCart(productId);
}

function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = document.getElementById('totalAmount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (totalAmount) totalAmount.textContent = total.toFixed(2);
    if (cartTotal) cartTotal.style.display = 'flex';
}

// Remove from cart
function removeFromCart(productId) {
    VerdraAuth.removeFromUserCart(productId);
    loadCartItems();
    updateCartDisplay();
    updateCartCount();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        VerdraAuth.updateUserCartQuantity(productId, newQuantity);
        loadCartItems();
        updateCartDisplay();
        updateCartCount();
    }
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        VerdraAuth.setUserCart([]);
        loadCartItems();
        updateCartDisplay();
        updateCartCount();
    }
}

// Checkout
function checkout() {
    // Implement checkout logic here
    alert('Proceeding to checkout...');
}

// Show notification
function showNotification(message) {
    showAlert(message, 'info');
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

function navigateToProduct(productId) {
    window.location.href = `Product.html?id=${productId}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (!VerdraAuth.requireAuth()) return;
    
    loadCartItems();
    updateCartDisplay();
    updateCartCount();
});