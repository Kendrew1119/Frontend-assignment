// State (module scope)
let bs_allProducts = [];
let bs_filteredProducts = [];
let bs_currentCategory = '';
let bs_currentSort = 'sales';
let bs_filtersInitialized = false;

console.log('BestSeller.js: Script loaded successfully!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('BestSeller.js: DOM loaded, starting to fetch products...');

    // Test: Try to load products with multiple fallback methods
    bs_loadProductsWithFallback();
});

function bs_loadProductsWithFallback() {
    console.log('BestSeller.js: Trying to load products...');
    
    // Method 1: Try relative path
    fetch('./Products.json')
        .then(response => {
            console.log('BestSeller.js: Fetch response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            console.log('BestSeller.js: Products loaded successfully!');
            console.log('BestSeller.js: Products count:', products.length);
            bs_handleProductsLoaded(products);
        })
        .catch(err => {
            console.error('BestSeller.js: Method 1 failed:', err);
            
            // Method 2: Try absolute path
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
                    console.log('BestSeller.js: Method 2 succeeded!');
                    bs_handleProductsLoaded(products);
                })
                .catch(err2 => {
                    console.error('BestSeller.js: Method 2 failed:', err2);
                    
                    // Method 3: Use hardcoded test data
                    console.log('BestSeller.js: Using hardcoded test data');
                    const testProducts = [
                        {
                            id: 1,
                            name: "Test Product 1",
                            price: 15.99,
                            category: "Skincare",
                            description: "Test product",
                            image: "Image/sunscreen.jpg",
                            rating: 4,
                            sales: 600,
                            newArrival: false
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
                    bs_handleProductsLoaded(testProducts);
                });
        });
}

function bs_handleProductsLoaded(products) {
    console.log('BestSeller.js: Handling loaded products:', products.length);
    bs_allProducts = products;
    bs_setupFilters();
    bs_loadProducts();
}

function bs_setupFilters() {
    if (bs_filtersInitialized) {
        return;
    }
    bs_filtersInitialized = true;

    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            bs_currentCategory = e.target.value;
            bs_filterAndSortProducts();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            bs_currentSort = e.target.value;
            bs_filterAndSortProducts();
        });
    }

    // Add clear filters functionality once
    bs_addClearFiltersButton();
}

function bs_addClearFiltersButton() {
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
    clearButton.addEventListener('click', bs_clearFilters);
    
    filterRight.appendChild(clearButton);
}

function bs_clearFilters() {
    bs_currentCategory = '';
    bs_currentSort = 'sales';
    
    // Reset select elements
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) categoryFilter.value = '';
    if (sortFilter) sortFilter.value = 'sales';
    
    // Reapply filters
    bs_filterAndSortProducts();
}

function bs_filterAndSortProducts() {
    console.log('BestSeller.js: filterAndSortProducts called');
    console.log('BestSeller.js: allProducts count:', bs_allProducts.length);
    console.log('BestSeller.js: currentCategory:', bs_currentCategory);
    console.log('BestSeller.js: currentSort:', bs_currentSort);
    
    // Debug: Check high sales products
    const highSalesProducts = bs_allProducts.filter(product => product.sales > 500);
    console.log('BestSeller.js: Products with sales > 500:', highSalesProducts.length);
    console.log('BestSeller.js: Sample high sales products:', highSalesProducts.slice(0, 3));
    
    // First filter by sales threshold and category
    bs_filteredProducts = bs_allProducts.filter(product => {
        const hasHighSales = product.sales > 500;
        
        // Map HTML select values to JSON categories
        let categoryMatch = true;
        if (bs_currentCategory) {
            const categoryMap = {
                'skincare': 'Skincare',
                'haircare': 'Hair Care',
                'bodycare': 'Body Care',
                'makeup': 'Makeup'
            };
            const expectedCategory = categoryMap[bs_currentCategory];
            categoryMatch = product.category === expectedCategory;
        }
        
        return hasHighSales && categoryMatch;
    });

    console.log('BestSeller.js: filteredProducts count:', bs_filteredProducts.length);
    console.log('BestSeller.js: Sample filtered products:', bs_filteredProducts.slice(0, 3));

    // Then sort the filtered products
    bs_sortProducts();

    // Update the display
    bs_displayProducts();
    bs_updateProductCount();
}

function bs_sortProducts() {
    switch (bs_currentSort) {
        case 'sales':
            bs_filteredProducts.sort((a, b) => b.sales - a.sales);
            break;
        case 'rating':
            bs_filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            bs_filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            bs_filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            bs_filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            bs_filteredProducts.sort((a, b) => b.sales - a.sales);
    }
}

function bs_displayProducts() {
    console.log('BestSeller.js: displayProducts called');
            const grid = document.querySelector('.ProductsGrid');
    console.log('BestSeller.js: ProductsGrid element found:', !!grid);
    
    if (!grid) {
        console.error('BestSeller.js: ProductsGrid element not found!');
        return;
    }

            grid.innerHTML = '';
            
    if (bs_filteredProducts.length === 0) {
        console.log('BestSeller.js: No products to display, showing no products message');
                grid.innerHTML = `
                    <div class="no-products-message">
                <p>No best selling products found in the selected category.</p>
                    </div>
                `;
                return;
            }

    console.log('BestSeller.js: Displaying', bs_filteredProducts.length, 'products');
    bs_filteredProducts.forEach(product => {
                grid.innerHTML += `
                    <div class="ProductItem" data-category="${product.category ? product.category.toLowerCase() : ''}" onclick="navigateToProduct(${product.id})">
                        <div class="ProductImageContainer">
                            <img class="ProductImage" src="${product.image}" alt="${product.name}">
                            <div class="ProductBadge">Best Seller</div>
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

function bs_updateProductCount() {
    const filterTitle = document.querySelector('.FilterTitle');
    if (filterTitle) {
        const totalBestSellers = bs_allProducts.filter(product => product.sales > 500).length;
        filterTitle.textContent = `Showing ${bs_filteredProducts.length} of ${totalBestSellers} best selling products`;
    }
}

function bs_loadProducts() {
    // Initial load with default filters
    console.log('BestSeller.js: loadProducts called');
    bs_filterAndSortProducts();
    
    // Test: Force display some products for debugging
    setTimeout(() => {
        console.log('BestSeller.js: Testing display after 1 second...');
        const grid = document.querySelector('.ProductsGrid');
        if (grid && bs_filteredProducts.length === 0) {
            console.log('BestSeller.js: No products found, showing test message');
            grid.innerHTML = `
                <div class="no-products-message">
                    <p>Debug: No products found. Check console for details.</p>
                    <p>Total products loaded: ${bs_allProducts.length}</p>
                    <p>High sales products: ${bs_allProducts.filter(p => p.sales > 500).length}</p>
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
        .then(products => {
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