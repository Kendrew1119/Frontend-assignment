document.addEventListener('DOMContentLoaded', () => {
    // Get current category from the page title or URL
    const currentPath = window.location.pathname;
    let activeCategory = '';
    
    if (currentPath.includes('SkinCare')) {
        activeCategory = 'Skincare';
    } else if (currentPath.includes('HairCare')) {
        activeCategory = 'Hair Care';
    } else if (currentPath.includes('BodyCare')) {
        activeCategory = 'Body Care';
    } else if (currentPath.includes('Makeup')) {
        activeCategory = 'Makeup';
    }

    let allProducts = []; // Store all products for filtering
    
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            allProducts = products.filter(product => product.category === activeCategory);
            displayProducts(allProducts);
            setupFilterListeners();
        })
        .catch(err => console.error('Failed to load products:', err));

    // Add event listeners for wishlist and cart buttons
    document.querySelectorAll('.heart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.closest('.product-card').dataset.id;
            addToWishlist(productId);
        });
    });

    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.closest('.product-card').dataset.id;
            addToCart(productId);
        });
    });
});

function displayProducts(products) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    products.forEach(product => {
        grid.innerHTML += `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image-container" onclick="navigateToProduct(${product.id})">
                    <img src="${product.image}" alt="${product.name}" class="product-image-box">
                    <button class="heart-btn" onclick="handleWishlistClick(event, ${product.id})" aria-label="Add to favorites">
                        <svg class="heart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 21C12 21 4 13.667 4 8.5C4 5.462 6.462 3 9.5 3C11.24 3 12.91 4.058 13.5 5.355C14.09 4.058 15.76 3 17.5 3C20.538 3 23 5.462 23 8.5C23 13.667 15 21 15 21H12Z"/>
                        </svg>
                    </button>
                </div>
                <div class="product-content" onclick="navigateToProduct(${product.id})">
                    <div class="brand-name">Verdra</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="rating-stars">
                        ${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}
                    </div>
                    <div class="price-section">
                        <span class="price-current">RM${product.price.toFixed(2)}</span>
                        <button class="cart-btn" onclick="handleCartClick(event, ${product.id})" aria-label="Add to cart">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Handle wishlist button click
function handleWishlistClick(event, productId) {
    event.preventDefault();
    event.stopPropagation(); // Prevent navigation
    
    if (!VerdraAuth.isLoggedIn()) {
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    // Save to wishlist
    let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    if (!wishlistItems.find(item => item.id === productId)) {
        fetch('Products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === productId);
                if (product) {
                    wishlistItems.push(product);
                    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
                    showNotification('Item added to wishlist!');
                }
            });
    } else {
        showNotification('Item already in wishlist!');
    }
}

// Handle cart button click
function handleCartClick(event, productId) {
    event.preventDefault();
    event.stopPropagation(); // Prevent navigation
    
    if (!VerdraAuth.isLoggedIn()) {
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    // Save to cart
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find(item => item.id === productId);
    
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push({ ...product, quantity: 1 });
                }
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                showNotification('Item added to cart!');
            }
        });
}

// Navigation function
function navigateToProduct(productId) {
    window.location.href = `Product.html?id=${productId}`;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
}