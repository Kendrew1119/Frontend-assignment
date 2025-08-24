// Product data
const products = [
    {
        id: 1,
        name: "Botanical Cleansing Oil",
        description: "Gentle oil cleanser with organic botanicals for deep cleansing while maintaining natural moisture.",
        price: 45.00,
        icon: "🌿"
    },
    {
        id: 2,
        name: "Hydrating Rose Serum",
        description: "Luxurious serum infused with rose essence and hyaluronic acid for intense hydration.",
        price: 65.00,
        icon: "🌹"
    },
    {
        id: 3,
        name: "Green Tea Face Mask",
        description: "Purifying clay mask with green tea extract to detoxify and refresh your skin.",
        price: 35.00,
        icon: "🍵"
    },
    {
        id: 4,
        name: "Vitamin C Brightening Cream",
        description: "Daily moisturizer with vitamin C and natural antioxidants for radiant, even-toned skin.",
        price: 55.00,
        icon: "☀️"
    },
    {
        id: 5,
        name: "Lavender Night Repair",
        description: "Overnight treatment with lavender and peptides to repair and rejuvenate while you sleep.",
        price: 70.00,
        icon: "🌙"
    },
    {
        id: 6,
        name: "Chamomile Eye Cream",
        description: "Gentle eye cream with chamomile and collagen to reduce puffiness and fine lines.",
        price: 40.00,
        icon: "👁️"
    }
];

// Cart state
let cartItems = [];

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

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
                <button class="continue-shopping" onclick="window.location.href='Home.html'">Continue Shopping</button>
            </div>
        `;
        cartTotal.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="item-price">RM${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');

    updateCartTotal();
}

function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
    document.getElementById('cartTotal').style.display = 'flex';
}

// Remove from cart
function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();
    updateCartCount();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();
        updateCartCount();
    }
}

// Checkout
function checkout() {
    // Implement checkout logic here
    alert('Proceeding to checkout...');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartDisplay();
    updateCartCount();
});

document.addEventListener('DOMContentLoaded', () => {
    if (!VerdraAuth.requireAuth()) return;
    
    // Rest of your initialization code...
});