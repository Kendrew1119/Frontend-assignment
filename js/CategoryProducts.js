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
});

function displayProducts(products) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <p>No products found</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        grid.innerHTML += `
            <div class="product-card" onclick="navigateToProduct(${product.id})">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image-box">
                    <button class="heart-btn" aria-label="Add to favorites" onclick="addToWishlist(event, ${product.id})">
                        <svg class="heart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 21C12 21 4 13.667 4 8.5C4 5.462 6.462 3 9.5 3C11.24 3 12.91 4.058 13.5 5.355C14.09 4.058 15.76 3 17.5 3C20.538 3 23 5.462 23 8.5C23 13.667 15 21 15 21H12Z"/>
                        </svg>
                    </button>
                    ${product.sales > 500 ? '<div class="badge-best-seller">Best Seller</div>' : ''}
                </div>
                <div class="product-content">
                    <div class="brand-name">Verdra</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="rating-stars">
                        ${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}
                    </div>
                    <div class="price-section">
                        <span class="price-current">RM${product.price.toFixed(2)}</span>
                        <button class="CartButton" onclick="addToCart(event, ${product.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
                                <circle r="1" cy="21" cx="9"></circle>
                                <circle r="1" cy="21" cx="20"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    // Update product count
    const filterTitle = document.querySelector('.filter-title');
    if (filterTitle) {
        filterTitle.textContent = `Filters (${products.length} products)`;
    }
}

function setupFilterListeners() {
    // Price range filter
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = this.value;
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }

    // Category checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Apply filters button
    const applyButton = document.querySelector('.apply-filters-btn');
    if (applyButton) {
        applyButton.addEventListener('click', applyFilters);
    }

    // Rating and sales buttons
    document.querySelectorAll('.rating-btn, .sales-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = btn.parentElement.querySelectorAll('button');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Toggle active class on clicked button
            btn.classList.toggle('active');
            
            // Apply filters
            applyFilters();
        });
    });
}

function applyFilters() {
    let filteredProducts = [...allProducts];

    // Price filter
    const maxPrice = parseFloat(document.getElementById('priceRange').value);
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);

    // Rating filter
    const selectedRating = document.querySelector('.rating-btn.active')?.dataset.rating;
    if (selectedRating) {
        filteredProducts = filteredProducts.filter(product => product.rating >= parseInt(selectedRating));
    }

    // Sales filter
    const selectedSales = document.querySelector('.sales-btn.active')?.dataset.sales;
    if (selectedSales) {
        filteredProducts = filteredProducts.filter(product => product.sales >= parseInt(selectedSales));
    }

    // Apply sorting
    const sortMethod = document.getElementById('sort-select').value;
    switch(sortMethod) {
        case 'Price: Low to High':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'Price: High to Low':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'Best Selling':
            filteredProducts.sort((a, b) => b.sales - a.sales);
            break;
        case 'Customer Rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'Newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }

    displayProducts(filteredProducts);
}

// Navigation and cart functions
function navigateToProduct(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    window.location.href = `Product.html?id=${productId}`;
}

function addToWishlist(event, productId) {
    event.stopPropagation();
    alert("Added to wishlist!");
}

function addToCart(event, productId) {
    event.stopPropagation();
    alert("Added to cart!");
}