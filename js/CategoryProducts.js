// Category Products - Filtering and Sorting
let cp_allProducts = [];
let cp_filteredProducts = [];
let cp_activeCategory = '';
let cp_initialized = false;

// Current filter/sort state
let cp_maxPrice = Infinity;
let cp_minRating = 0;
let cp_minSales = 0;
let cp_sortOption = 'Best Selling';

document.addEventListener('DOMContentLoaded', () => {
    if (cp_initialized) return;
    cp_initialized = true;

    // Detect active category from URL
    const currentPath = window.location.pathname;
    if (currentPath.includes('SkinCare')) {
        cp_activeCategory = 'Skincare';
    } else if (currentPath.includes('HairCare')) {
        cp_activeCategory = 'Hair Care';
    } else if (currentPath.includes('BodyCare')) {
        cp_activeCategory = 'Body Care';
    } else if (currentPath.includes('Makeup')) {
        cp_activeCategory = 'Makeup';
    }

    // Fetch and initialize
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            cp_allProducts = products.filter(p => p.category === cp_activeCategory);
            // Initialize defaults based on data
            const maxPriceInCategory = cp_allProducts.reduce((m, p) => Math.max(m, p.price), 0);
            cp_maxPrice = maxPriceInCategory || Infinity;
            initializeControls(maxPriceInCategory);
            cp_filterAndSortProducts();
        })
        .catch(err => console.error('Failed to load products:', err));
});

function initializeControls(maxPriceInCategory) {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const ratingBtns = Array.from(document.querySelectorAll('.rating-btn'));
    const salesBtns = Array.from(document.querySelectorAll('.sales-btn'));
    const applyBtn = document.querySelector('.apply-filters-btn');
    const sortSelect = document.getElementById('sort-select');

    // Price range setup
    if (priceRange && priceValue) {
        // Normalize range to category max (fallback to 100)
        const maxRange = Math.max(100, Math.ceil(maxPriceInCategory));
        priceRange.max = String(maxRange);
        if (!priceRange.value) priceRange.value = String(Math.ceil(maxRange));
        priceValue.textContent = priceRange.value;
        cp_maxPrice = parseFloat(priceRange.value);

        priceRange.addEventListener('input', () => {
            priceValue.textContent = priceRange.value;
        });
    }

    // Rating filter (toggle select one)
    ratingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.dataset.rating ? parseInt(btn.dataset.rating, 10) : 0;
            if (cp_minRating === selected) {
                cp_minRating = 0;
                ratingBtns.forEach(b => b.classList.remove('active'));
            } else {
                cp_minRating = selected;
                ratingBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    // Sales filter (toggle select one)
    salesBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.dataset.sales ? parseInt(btn.dataset.sales, 10) : 0;
            if (cp_minSales === selected) {
                cp_minSales = 0;
                salesBtns.forEach(b => b.classList.remove('active'));
            } else {
                cp_minSales = selected;
                salesBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    // Apply filters
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            if (priceRange) cp_maxPrice = parseFloat(priceRange.value || String(maxPriceInCategory));
            cp_filterAndSortProducts();
        });
    }

    // Sort select
    if (sortSelect) {
        cp_sortOption = sortSelect.value || 'Best Selling';
        sortSelect.addEventListener('change', () => {
            cp_sortOption = sortSelect.value;
            cp_filterAndSortProducts();
        });
    }
}

function cp_filterAndSortProducts() {
    // Filter by price, rating, sales
    cp_filteredProducts = cp_allProducts.filter(p => {
        const priceOk = p.price <= cp_maxPrice;
        const ratingOk = p.rating >= cp_minRating;
        const salesOk = p.sales >= cp_minSales;
        return priceOk && ratingOk && salesOk;
    });

    // Sort
    switch (cp_sortOption) {
        case 'Best Selling':
            cp_filteredProducts.sort((a, b) => b.sales - a.sales);
            break;
        case 'Price: Low to High':
            cp_filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'Price: High to Low':
            cp_filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'Newest':
            cp_filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'Customer Rating':
            cp_filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            cp_filteredProducts.sort((a, b) => b.sales - a.sales);
    }

    displayProducts(cp_filteredProducts);
}

function displayProducts(products) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!products || products.length === 0) {
        grid.innerHTML = `
            <div class="no-products-message">
                <p>No products match the selected filters.</p>
            </div>
        `;
        return;
    }

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
                    <button class="cart-btn" onclick="handleCartClick(event, ${product.id})" aria-label="Add to cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
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
    
    console.log('CategoryProducts.js: handleWishlistClick called for product:', productId);
    
    if (!VerdraAuth.isLoggedIn()) {
        console.log('CategoryProducts.js: User not logged in, redirecting to login');
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    console.log('CategoryProducts.js: User is logged in, adding to wishlist');

    // Save to user-specific wishlist
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                if (VerdraAuth.addToUserWishlist(product)) {
                    showAlert('Item added to wishlist!', 'success');
                    console.log('CategoryProducts.js: Product added to wishlist successfully');
                } else {
                    showAlert('Item already in wishlist!', 'info');
                    console.log('CategoryProducts.js: Product already in wishlist');
                }
            }
        })
        .catch(err => {
            console.error('CategoryProducts.js: Failed to add to wishlist:', err);
            showAlert('Failed to add to wishlist. Please try again.', 'error');
        });
}

// Handle cart button click
function handleCartClick(event, productId) {
    event.preventDefault();
    event.stopPropagation(); // Prevent navigation
    
    console.log('CategoryProducts.js: handleCartClick called for product:', productId);
    
    if (!VerdraAuth.isLoggedIn()) {
        console.log('CategoryProducts.js: User not logged in, redirecting to login');
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    console.log('CategoryProducts.js: User is logged in, adding to cart');

    // Save to user-specific cart
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                VerdraAuth.addToUserCart(product);
                showAlert('Item added to cart!', 'success');
                console.log('CategoryProducts.js: Product added to cart successfully');
            }
        })
        .catch(err => {
            console.error('CategoryProducts.js: Failed to add to cart:', err);
            showAlert('Failed to add to cart. Please try again.', 'error');
        });
}

// Navigation function
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