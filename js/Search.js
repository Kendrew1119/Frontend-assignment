document.addEventListener('DOMContentLoaded', () => {
    console.log('Search.js loaded and initialized');
    initializeSearch();
});

// Product data - should ideally come from your Products.json file
let allProducts = [];

// Search state
let filteredProducts = [];
let currentFilter = 'all';
let currentSearchTerm = '';
let displayLimit = 12;
let currentDisplayCount = 0;

// DOM Elements
let searchForm, searchInput, defaultContent, searchResults, noResults;
let productGrid, resultsCount, filterButtons, loadMoreButton;

function initializeSearch() {
    // Get DOM elements
    searchForm = document.getElementById('searchForm');
    searchInput = document.getElementById('searchInput');
    defaultContent = document.getElementById('defaultContent');
    searchResults = document.getElementById('searchResults');
    noResults = document.getElementById('noResults');
    productGrid = document.getElementById('productGrid');
    resultsCount = document.getElementById('resultsCount');
    filterButtons = document.querySelectorAll('.FilterButton');
    loadMoreButton = document.getElementById('loadMore');

    // Setup close button
    const closeButton = document.getElementById('CloseSearchButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            window.parent.postMessage('closeSearchPanel', '*');
        });
    }

    // Load products and setup event listeners
    loadProducts().then(() => {
        setupEventListeners();
    });
}

async function loadProducts() {
    try {
        // Try to load from Products.json first
        const response = await fetch('Products.json');
        if (response.ok) {
            allProducts = await response.json();
        } else {
            // Fallback to hardcoded products if file not found
            allProducts = getHardcodedProducts();
        }
    } catch (error) {
        console.log('Loading fallback products');
        allProducts = getHardcodedProducts();
    }
}

function getHardcodedProducts() {
    return [
        {
            id: 1,
            name: "Vitamin C Brightening Serum",
            category: "Skincare",
            price: 89.00,
            description: "Powerful antioxidant serum with 20% vitamin C",
            image: "Image/vitamin-c-serum.jpg",
            rating: 5
        },
        {
            id: 2,
            name: "Hyaluronic Acid Moisturizer",
            category: "Skincare",
            price: 65.00,
            description: "Intense hydration with pure hyaluronic acid",
            image: "Image/moisturizer.jpg",
            rating: 4
        },
        {
            id: 3,
            name: "Gentle Cleansing Oil",
            category: "Skincare",
            price: 45.00,
            description: "Natural oil cleanser for all skin types",
            image: "Image/cleansing-oil.jpg",
            rating: 4
        },
        {
            id: 4,
            name: "Nourishing Hair Mask",
            category: "Hair Care",
            price: 35.00,
            description: "Deep conditioning treatment for damaged hair",
            image: "Image/hair-mask.jpg",
            rating: 5
        },
        {
            id: 5,
            name: "Volumizing Shampoo",
            category: "Hair Care",
            price: 28.00,
            description: "Sulfate-free formula for fine hair",
            image: "Image/shampoo.jpg",
            rating: 4
        },
        {
            id: 6,
            name: "Body Butter Lavender",
            category: "Body Care",
            price: 32.00,
            description: "Rich moisturizer with organic lavender",
            image: "Image/body-butter.jpg",
            rating: 5
        },
        {
            id: 7,
            name: "Exfoliating Body Scrub",
            category: "Body Care",
            price: 26.00,
            description: "Natural sugar scrub with essential oils",
            image: "Image/body-scrub.jpg",
            rating: 4
        },
        {
            id: 8,
            name: "Tinted Lip Balm",
            category: "Makeup",
            price: 18.00,
            description: "Nourishing lip color with SPF protection",
            image: "Image/lip-balm.jpg",
            rating: 4
        },
        {
            id: 9,
            name: "Natural Foundation",
            category: "Makeup",
            price: 42.00,
            description: "Clean beauty foundation with buildable coverage",
            image: "Image/foundation.jpg",
            rating: 5
        },
        {
            id: 10,
            name: "Retinol Night Cream",
            category: "Skincare",
            price: 75.00,
            description: "Anti-aging cream with gentle retinol",
            image: "Image/night-cream.jpg",
            rating: 5
        }
    ];
}

function setupEventListeners() {
    // Search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // Search input changes
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Popular search tags
    document.querySelectorAll('.SearchTag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const searchTerm = tag.dataset.search;
            if (searchTerm === '') {
                clearSearch();
            } else {
                searchInput.value = searchTerm;
                handleSearch(e);
            }
        });
    });
    
    // Category cards
    document.querySelectorAll('.CategoryCard').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            if (category) {
                searchInput.value = category;
                handleSearch();
            }
        });
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveFilter(button.dataset.filter);
            applyFilters();
        });
    });
    
    // Load more button
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreProducts);
    }
}

function handleSearch(e) {
    if (e) e.preventDefault();
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    currentSearchTerm = searchTerm;
    
    if (searchTerm === '') {
        clearSearch();
        return;
    }
    
    // Add searching animation
    searchInput.classList.add('searching');
    
    // Simulate search delay for better UX
    setTimeout(() => {
        performSearch(searchTerm);
        searchInput.classList.remove('searching');
    }, 300);
}

function performSearch(searchTerm) {
    // Filter products based on search term
    filteredProducts = allProducts.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const descriptionMatch = product.description.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category.toLowerCase().includes(searchTerm);
        
        return nameMatch || descriptionMatch || categoryMatch;
    });
    
    // Reset filter to 'all' when searching
    currentFilter = 'all';
    setActiveFilter('all');
    
    showSearchResults();
}

function applyFilters() {
    let filtered = currentSearchTerm ? 
        allProducts.filter(product => {
            const nameMatch = product.name.toLowerCase().includes(currentSearchTerm);
            const descriptionMatch = product.description.toLowerCase().includes(currentSearchTerm);
            const categoryMatch = product.category.toLowerCase().includes(currentSearchTerm);
            return nameMatch || descriptionMatch || categoryMatch;
        }) : 
        [...allProducts];
    
    if (currentFilter !== 'all') {
        const filterMap = {
            'skincare': 'Skincare',
            'hair': 'Hair Care',
            'body': 'Body Care',
            'makeup': 'Makeup'
        };
        
        const categoryToFilter = filterMap[currentFilter] || currentFilter;
        filtered = filtered.filter(product => product.category === categoryToFilter);
    }
    
    filteredProducts = filtered;
    showSearchResults();
}

function showSearchResults() {
    if (!searchResults || !defaultContent || !noResults) return;
    
    defaultContent.style.display = 'none';
    noResults.classList.remove('show');
    
    if (filteredProducts.length === 0) {
        searchResults.style.display = 'none';
        noResults.classList.add('show');
        return;
    }
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`;
    }
    
    // Reset display count and render products
    currentDisplayCount = 0;
    renderProducts();
    searchResults.classList.add('show');
    searchResults.style.display = 'block';
}

function renderProducts() {
    if (!productGrid) return;
    
    const productsToShow = filteredProducts.slice(0, currentDisplayCount + displayLimit);
    currentDisplayCount = productsToShow.length;
    
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    // Show/hide load more button
    if (loadMoreButton) {
        loadMoreButton.style.display = currentDisplayCount < filteredProducts.length ? 'block' : 'none';
    }
}

function createProductCard(product) {
    console.log('Creating product card for:', product.name);
    const card = document.createElement('div');
    card.className = 'ProductCard';
    
    // Create rating stars
    const ratingStars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    
    card.innerHTML = `
        <div class="ProductImage" onclick="navigateToProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="ProductImagePlaceholder" style="display: none; align-items: center; justify-content: center; height: 100%; font-size: 2.5rem;">
                ${getCategoryIcon(product.category)}
            </div>
            <button class="heart-btn" onclick="handleWishlistClick(event, ${product.id})" aria-label="Add to wishlist">
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
        <div class="ProductInfo" onclick="navigateToProduct(${product.id})">
            <div class="ProductCategory">${product.category}</div>
            <h3 class="ProductName">${product.name}</h3>
            <p class="ProductDescription">${product.description}</p>
            <div class="ProductRating">
                <span class="rating-stars">${ratingStars}</span>
            </div>
            <div class="ProductPrice">RM${product.price.toFixed(2)}</div>
        </div>
    `;
    
    console.log('Product card created with buttons for product:', product.id);
    return card;
}

function getCategoryIcon(category) {
    const icons = {
        'Skincare': '🧴',
        'Hair Care': '💆‍♀️',
        'Body Care': '🛁',
        'Makeup': '💄'
    };
    return icons[category] || '🧴';
}

function setActiveFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
}

function clearSearch() {
    searchInput.value = '';
    currentSearchTerm = '';
    currentFilter = 'all';
    setActiveFilter('all');
    
    if (defaultContent) defaultContent.style.display = 'block';
    if (searchResults) searchResults.classList.remove('show');
    if (noResults) noResults.classList.remove('show');
}

function loadMoreProducts() {
    const remainingProducts = filteredProducts.length - currentDisplayCount;
    const productsToAdd = Math.min(displayLimit, remainingProducts);
    
    if (productsToAdd > 0) {
        const startIndex = currentDisplayCount;
        const endIndex = currentDisplayCount + productsToAdd;
        const newProducts = filteredProducts.slice(startIndex, endIndex);
        
        newProducts.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
        
        currentDisplayCount += productsToAdd;
        
        // Hide load more button if no more products
        if (currentDisplayCount >= filteredProducts.length && loadMoreButton) {
            loadMoreButton.style.display = 'none';
        }
    }
}

// Navigation and interaction functions
function navigateToProduct(productId) {
    console.log('Navigating to product:', productId);
    // Close search panel and navigate to product
    window.parent.postMessage({
        type: 'navigate',
        url: `Product.html?id=${productId}`
    }, '*');
    console.log('Navigation message sent to parent');
}

function handleWishlistClick(event, productId) {
    console.log('Search.js: Wishlist button clicked for product:', productId);
    event.preventDefault();
    event.stopPropagation();
    
    if (!VerdraAuth.isLoggedIn()) {
        console.log('Search.js: User not logged in, redirecting to login');
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    console.log('Search.js: User is logged in, adding to wishlist');

    // Save to user-specific wishlist
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                if (VerdraAuth.addToUserWishlist(product)) {
                    showAlert('Item added to wishlist!', 'success');
                    console.log('Search.js: Product added to wishlist successfully');
                } else {
                    showAlert('Item already in wishlist!', 'info');
                    console.log('Search.js: Product already in wishlist');
                }
            }
        })
        .catch(err => {
            console.error('Search.js: Failed to add to wishlist:', err);
            showAlert('Failed to add to wishlist. Please try again.', 'error');
        });
}

function handleCartClick(event, productId) {
    console.log('Search.js: Cart button clicked for product:', productId);
    event.preventDefault();
    event.stopPropagation();
    
    if (!VerdraAuth.isLoggedIn()) {
        console.log('Search.js: User not logged in, redirecting to login');
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    console.log('Search.js: User is logged in, adding to cart');

    // Save to user-specific cart
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                VerdraAuth.addToUserCart(product);
                showAlert('Item added to cart!', 'success');
                console.log('Search.js: Product added to cart successfully');
            }
        })
        .catch(err => {
            console.error('Search.js: Failed to add to cart:', err);
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Expose functions globally for onclick handlers
window.navigateToProduct = navigateToProduct;
window.handleWishlistClick = handleWishlistClick;
window.handleCartClick = handleCartClick;

// Close search panel when clicking outside
document.addEventListener('click', (e) => {
    const searchPanel = document.getElementById('SearchPanel');
    const searchButton = document.querySelector('.SearchButton');
    
    if (searchPanel && searchPanel.classList.contains('active')) {
        if (!searchPanel.contains(e.target) && !searchButton.contains(e.target)) {
            closeSearchPanel();
        }
    }
});

// Close search panel on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const searchPanel = document.getElementById('SearchPanel');
        if (searchPanel && searchPanel.classList.contains('active')) {
            closeSearchPanel();
        }
    }
});