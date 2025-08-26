// State (module scope)
let allProducts = [];
let filteredProducts = [];
let currentCategory = '';
let currentSort = 'newest';
let filtersInitialized = false;

console.log('NewArrival.js: Script loaded successfully!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('NewArrival.js: DOM loaded, starting to fetch products...');

    // Test: Try to load products with multiple fallback methods
    loadProductsWithFallback();
});

function loadProductsWithFallback() {
    console.log('NewArrival.js: Trying to load products...');
    
    // Method 1: Try relative path
    fetch('./Products.json')
        .then(response => {
            console.log('NewArrival.js: Fetch response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            console.log('NewArrival.js: Products loaded successfully!');
            console.log('NewArrival.js: Products count:', products.length);
            handleProductsLoaded(products);
        })
        .catch(err => {
            console.error('NewArrival.js: Method 1 failed:', err);
            
            // Method 2: Try absolute path
            fetch('Products.json')
                .then(response => response.json())
                .then(products => {
                    console.log('NewArrival.js: Method 2 succeeded!');
                    handleProductsLoaded(products);
                })
                .catch(err2 => {
                    console.error('NewArrival.js: Method 2 failed:', err2);
                    
                    // Method 3: Use hardcoded test data
                    console.log('NewArrival.js: Using hardcoded test data');
                    const testProducts = [
                        {
                            id: 1,
                            name: "Test Product 1",
                            price: 15.99,
                            category: "Skincare",
                            description: "Test product",
                            image: "Image/sunscreen.jpg",
                            rating: 4,
                            sales: 150,
                            newArrival: true
                        },
                        {
                            id: 2,
                            name: "Test Product 2",
                            price: 12.99,
                            category: "Body Care",
                            description: "Test product",
                            image: "Image/body_lotion.jpg",
                            rating: 5,
                            sales: 650,
                            newArrival: true
                        }
                    ];
                    handleProductsLoaded(testProducts);
                });
        });
}

function handleProductsLoaded(products) {
    console.log('NewArrival.js: Handling loaded products:', products.length);
    allProducts = products;
    setupFilters();
    loadProducts();
}

function setupFilters() {
    if (filtersInitialized) {
        return;
    }
    filtersInitialized = true;

    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            filterAndSortProducts();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndSortProducts();
        });
    }

    // Add clear filters functionality once
    addClearFiltersButton();
}

function addClearFiltersButton() {
    const filterRight = document.querySelector('.FilterRight');
    if (!filterRight) return;

    // Prevent duplicates
    if (filterRight.querySelector('.ClearFiltersBtn')) {
        return;
    }

    const clearButton = document.createElement('button');
    clearButton.className = 'ClearFiltersBtn';
    clearButton.type = 'button';
    clearButton.textContent = 'Clear Filters';
    clearButton.addEventListener('click', clearFilters);
    
    filterRight.appendChild(clearButton);
}

function clearFilters() {
    currentCategory = '';
    currentSort = 'newest';
    
    // Reset select elements
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) categoryFilter.value = '';
    if (sortFilter) sortFilter.value = 'newest';
    
    // Reapply filters
    filterAndSortProducts();
}

function filterAndSortProducts() {
    console.log('NewArrival.js: filterAndSortProducts called');
    console.log('NewArrival.js: allProducts count:', allProducts.length);
    console.log('NewArrival.js: currentCategory:', currentCategory);
    console.log('NewArrival.js: currentSort:', currentSort);
    
    // Debug: Check newArrival products
    const newArrivalProducts = allProducts.filter(product => product.newArrival === true);
    console.log('NewArrival.js: Products with newArrival=true:', newArrivalProducts.length);
    console.log('NewArrival.js: Sample newArrival products:', newArrivalProducts.slice(0, 3));
    
    // First filter by new arrival and category
    filteredProducts = allProducts.filter(product => {
        const isNewArrival = product.newArrival === true;
        
        // Map HTML select values to JSON categories
        let categoryMatch = true;
        if (currentCategory) {
            const categoryMap = {
                'skincare': 'Skincare',
                'haircare': 'Hair Care',
                'bodycare': 'Body Care',
                'makeup': 'Makeup'
            };
            const expectedCategory = categoryMap[currentCategory];
            categoryMatch = product.category === expectedCategory;
        }
        
        return isNewArrival && categoryMatch;
    });

    console.log('NewArrival.js: filteredProducts count:', filteredProducts.length);
    console.log('NewArrival.js: Sample filtered products:', filteredProducts.slice(0, 3));

    // Then sort the filtered products
    sortProducts();

    // Update the display
    displayProducts();
    updateProductCount();
}

function sortProducts() {
    switch (currentSort) {
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'sales':
            filteredProducts.sort((a, b) => b.sales - a.sales);
            break;
        default:
            filteredProducts.sort((a, b) => b.id - a.id);
    }
}

function displayProducts() {
    console.log('NewArrival.js: displayProducts called');
    const grid = document.querySelector('.ProductsGrid');
    console.log('NewArrival.js: ProductsGrid element found:', !!grid);
    
    if (!grid) {
        console.error('NewArrival.js: ProductsGrid element not found!');
        return;
    }

    grid.innerHTML = '';

    if (filteredProducts.length === 0) {
        console.log('NewArrival.js: No products to display, showing no products message');
        grid.innerHTML = `
            <div class="no-products-message">
                <p>No new arrival products found in the selected category.</p>
            </div>
        `;
        return;
    }

    console.log('NewArrival.js: Displaying', filteredProducts.length, 'products');
    filteredProducts.forEach(product => {
        grid.innerHTML += `
            <div class="ProductItem" data-category="${product.category ? product.category.toLowerCase() : ''}" onclick="navigateToProduct(${product.id})">
                <div class="ProductImageContainer">
                    <img class="ProductImage" src="${product.image}" alt="${product.name}">
                    <div class="ProductBadge">New</div>
                    <button class="ProductWishlistBtn" onclick="addToWishlist(event, ${product.id})">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                    <div class="ProductOverlay">
                        <button class="QuickViewBtn" onclick="navigateToProduct(${product.id}, event)">Quick View</button>
                    </div>
                </div>
                <div class="ProductDetails">
                    <div class="ProductBrand">Verdra</div>
                    <h3 class="ProductName">${product.name}</h3>
                    <div class="ProductRating">
                        <div class="ProductStars">
                            ${'<svg class="StarIcon" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>'.repeat(product.rating)}
                        </div>
                        <span class="RatingCount">(${product.sales})</span>
                    </div>
                    <div class="ProductPriceRow">
                        <div class="ProductPrice">RM${product.price.toFixed(2)}</div>
                        <button class="ProductCartBtn" onclick="addToCart(event, ${product.id})">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function updateProductCount() {
    const filterTitle = document.querySelector('.FilterTitle');
    if (filterTitle) {
        const totalNewArrivals = allProducts.filter(product => product.newArrival === true).length;
        filterTitle.textContent = `Showing ${filteredProducts.length} of ${totalNewArrivals} new arrival products`;
    }
}

function loadProducts() {
    // Initial load with default filters
    console.log('NewArrival.js: loadProducts called');
    filterAndSortProducts();
    
    // Test: Force display some products for debugging
    setTimeout(() => {
        console.log('NewArrival.js: Testing display after 1 second...');
        const grid = document.querySelector('.ProductsGrid');
        if (grid && filteredProducts.length === 0) {
            console.log('NewArrival.js: No products found, showing test message');
            grid.innerHTML = `
                <div class="no-products-message">
                    <p>Debug: No products found. Check console for details.</p>
                    <p>Total products loaded: ${allProducts.length}</p>
                    <p>New arrival products: ${allProducts.filter(p => p.newArrival === true).length}</p>
                </div>
            `;
        }
    }, 1000);
}

function navigateToProduct(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    window.location.href = `Product.html?id=${productId}`;
}

function addToWishlist(event, productId) {
    event.stopPropagation();
    
    if (!VerdraAuth.isLoggedIn()) {
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    // Save to user-specific wishlist
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                if (VerdraAuth.addToUserWishlist(product)) {
                    showAlert('Item added to wishlist!', 'success');
                } else {
                    showAlert('Item already in wishlist!', 'info');
                }
            }
        })
        .catch(err => {
            console.error('Failed to add to wishlist:', err);
            showAlert('Failed to add to wishlist. Please try again.', 'error');
        });
}

function addToCart(event, productId) {
    event.stopPropagation();
    
    if (!VerdraAuth.isLoggedIn()) {
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    // Save to user-specific cart
    fetch('Products.json')
        .then(response => response.json())
        .then((products) => {
            const product = products.find(p => p.id === productId);
            if (product) {
                VerdraAuth.addToUserCart(product);
                showAlert('Item added to cart!', 'success');
            }
        })
        .catch(err => {
            console.error('Failed to add to cart:', err);
            showAlert('Failed to add to cart. Please try again.', 'error');
        });
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