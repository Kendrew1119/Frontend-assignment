document.addEventListener('DOMContentLoaded', () => {
    // Search Bar functionality
    const searchButton = document.querySelector('.SearchButton');
    const searchPanel = document.getElementById('SearchPanel');

    console.log('Search elements found:', { searchButton, searchPanel });

    if (searchButton && searchPanel) {
        searchButton.addEventListener('click', () => {
            console.log('Search button clicked!');
            searchPanel.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
            console.log('Search panel classes:', searchPanel.className);
            console.log('Search panel style:', searchPanel.style.cssText);
        });
        console.log('Search button event listener added');
    } else {
        console.log('Search elements not found:', { searchButton, searchPanel });
    }

    // Menu Dropdown functionality
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    let dropdownTimeout;

    if (menuBtn && menuDropdown) {
        // Show dropdown on hover
        menuBtn.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
            menuDropdown.classList.add('show');
        });

        // Hide dropdown with delay when leaving button
        menuBtn.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                menuDropdown.classList.remove('show');
            }, 200);
        });

        // Keep dropdown shown while hovering it
        menuDropdown.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
            menuDropdown.classList.add('show');
        });

        // Hide dropdown when leaving it
        menuDropdown.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                menuDropdown.classList.remove('show');
            }, 200);
        });
    } else {
        console.log('Menu elements not found:', { menuBtn, menuDropdown });
    }

    // Protected route buttons
    const protectedButtons = {
        '.CartButton': 'Cart.html',
        '.WishlistButton': 'Wishlist.html',
        '.NotificationButton': 'Noti.html'
    };

    Object.entries(protectedButtons).forEach(([selector, path]) => {
        document.querySelector(selector)?.addEventListener('click', (e) => {
            e.preventDefault();
            if (VerdraAuth.requireAuth()) {
                window.location.href = path;
            }
        });
    });

    // Setup search integration
    setupSearchIntegration();

    loadNewArrivals();
    loadBestSellers();
});

//Home banner auto slides

let index = 0;
const track = document.getElementById('bannerTrack');
const dots = document.querySelectorAll('.dot');
const total = 4;

// Auto slide
let slideInterval = setInterval(nextSlide, 3000);

function nextSlide() {
    index = (index + 1) % total;
    updateSlide();
}

function goToSlide(i) {
    index = i;
    updateSlide();
    resetInterval();
}

function updateSlide() {
    track.style.transform = `translateX(-${index * 1000}px)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
}

// Handle wishlist button click
function handleWishlistClick(event, productId) {
    event.preventDefault();
    event.stopPropagation(); // Prevent navigation to product page
    
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

    // Visual feedback
    const button = event.currentTarget;
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// Handle cart button click
function handleCartClick(event, productId) {
    event.preventDefault();
    event.stopPropagation(); // Prevent navigation to product page
    
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

    // Visual feedback
    const button = event.currentTarget;
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
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

window.addEventListener('message', (event) => {
    if (event.data === 'closeSearchPanel') {
        const searchPanel = document.getElementById('SearchPanel');
        if (searchPanel) {
            searchPanel.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scroll
        }
    }
});

// Load New Arrivals
function loadNewArrivals() {
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const newArrivalsGrid = document.querySelector('.NewArrivalsGrid');
            if (!newArrivalsGrid) return;

            const newArrivals = products
                .filter(product => product.newArrival)
                .slice(0, 5);

            newArrivalsGrid.innerHTML = newArrivals.map(product => `
                <div class="NewArrivalItem" onclick="navigateToProduct(${product.id})">
                    <div class="NewArrivalImageContainer">
                        <img src="${product.image}" alt="${product.name}" class="NewArrivalItemImage">
                        <div class="NewArrivalBadge">New</div>
                        <button class="NewArrivalWishlistBtn" onclick="handleWishlistClick(event, ${product.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 21C12 21 4 13.667 4 8.5C4 5.462 6.462 3 9.5 3C11.24 3 12.91 4.058 13.5 5.355C14.09 4.058 15.76 3 17.5 3C20.538 3 23 5.462 23 8.5C23 13.667 15 21 15 21H12Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="NewArrivalDetails">
                        <div class="NewArrivalBrand">Verdra</div>
                        <h3 class="NewArrivalName">${product.name}</h3>
                        <div class="NewArrivalPriceRow">
                            <span class="NewArrivalPrice">RM${product.price.toFixed(2)}</span>
                            <button class="NewArrivalCartBtn" onclick="handleCartClick(event, ${product.id})">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        });
}

function loadBestSellers() {
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const salesGrid = document.querySelector('.SalesGrid');
            if (!salesGrid) return;

            const bestSellers = products
                .filter(product => product.sales > 500)
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5);

            salesGrid.innerHTML = bestSellers.map(product => `
                <div class="SalesItem" onclick="navigateToProduct(${product.id})">
                    <div class="SalesImageContainer">
                        <img src="${product.image}" alt="${product.name}" class="SalesItemImage">
                        <div class="SalesBadge">Best Seller</div>
                        <button class="SalesWishlistBtn" onclick="handleWishlistClick(event, ${product.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 21C12 21 4 13.667 4 8.5C4 5.462 6.462 3 9.5 3C11.24 3 12.91 4.058 13.5 5.355C14.09 4.058 15.76 3 17.5 3C20.538 3 23 5.462 23 8.5C23 13.667 15 21 15 21H12Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="SalesDetails">
                        <div class="SalesBrand">Verdra</div>
                        <h3 class="SalesName">${product.name}</h3>
                        <div class="SalesRating">
                            ${'<svg class="SalesStarIcon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>'.repeat(product.rating)}
                        </div>
                        <div class="SalesPriceRow">
                            <span class="SalesPrice">RM${product.price.toFixed(2)}</span>
                            <button class="SalesCartBtn" onclick="handleCartClick(event, ${product.id})">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        });
}

// Navigation function
function navigateToProduct(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    window.location.href = `Product.html?id=${productId}`;
}

// Search Integration Functions
function setupSearchIntegration() {
    console.log('Setting up search integration...');
    // Listen for messages from search iframe
    window.addEventListener('message', handleSearchMessage);
    console.log('Search integration setup complete');
}

function handleSearchMessage(event) {
    console.log('Received message from search iframe:', event.data);
    // Handle messages from the search iframe
    if (typeof event.data === 'string') {
        if (event.data === 'closeSearchPanel') {
            closeSearchPanel();
        }
    } else if (typeof event.data === 'object') {
        switch (event.data.type) {
            case 'navigate':
                console.log('Navigating to:', event.data.url);
                closeSearchPanel();
                window.location.href = event.data.url;
                break;
                
            case 'addToWishlist':
                console.log('Adding to wishlist:', event.data.productId);
                closeSearchPanel();
                handleWishlistFromSearch(event.data.productId);
                break;
                
            case 'addToCart':
                console.log('Adding to cart:', event.data.productId);
                closeSearchPanel();
                handleCartFromSearch(event.data.productId);
                break;
        }
    }
}

function closeSearchPanel() {
    console.log('Closing search panel...');
    const searchPanel = document.getElementById('SearchPanel');
    if (searchPanel) {
        searchPanel.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        console.log('Search panel closed');
    } else {
        console.log('Search panel not found');
    }
}

function handleWishlistFromSearch(productId) {
    console.log('Handling wishlist from search for product:', productId);
    // Check if user is logged in
    if (!VerdraAuth || !VerdraAuth.isLoggedIn()) {
        console.log('User not logged in, redirecting to login');
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    // Load products and add to wishlist using user-specific storage
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
            console.error('Error adding to wishlist:', err);
            showAlert('Failed to add to wishlist. Please try again.', 'error');
        });
}

function handleCartFromSearch(productId) {
    console.log('Handling cart from search for product:', productId);
    // Check if user is logged in
    if (!VerdraAuth || !VerdraAuth.isLoggedIn()) {
        console.log('User not logged in, redirecting to login');
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    // Load products and add to cart using user-specific storage
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
            console.error('Error adding to cart:', err);
            showAlert('Failed to add to cart. Please try again.', 'error');
        });
}