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
let cart = [];

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
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty. Add some natural skincare products!</div>';
        cartTotal.style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <div class="item-icon">${item.icon}</div>
                <div>
                    <h4>${item.name}</h4>
                    <div class="item-price">$${item.price.toFixed(2)} each</div>
                </div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
    cartTotal.style.display = 'block';
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartCount();
}

// Clear cart
function clearCart() {
    if (cart.length > 0 && confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartDisplay();
        updateCartCount();
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase!\n\nOrder Summary:\n${cart.map(item => `${item.name} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nYour natural skincare products will be shipped within 2-3 business days.`);
    
    cart = [];
    updateCartDisplay();
    updateCartCount();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartDisplay();
    updateCartCount();
});