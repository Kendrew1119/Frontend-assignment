// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Heart button functionality
    initializeHeartButtons();
    
    // Filter buttons functionality
    initializeFilterButtons();
    
    // Add to cart functionality
    initializeAddToCartButtons();
    
    // View toggle functionality
    initializeViewToggle();
    
    // Load more functionality
    initializeLoadMore();
    
    // Newsletter subscription
    initializeNewsletter();
    
    // Filter functionality
    initializeFilters();
    
    // Sort functionality
    initializeSort();
    
    // Price range functionality
    initializePriceRange();
}

// Heart button functionality
function initializeHeartButtons() {
    document.querySelectorAll('.heart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('liked');
            
            if (this.classList.contains('liked')) {
                this.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>';
            } else {
                this.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>';
            }
        });
    });
}

// Filter buttons functionality
function initializeFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            this.parentElement.querySelectorAll('.filter-btn').forEach(sibling => {
                sibling.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
}

// Add to cart functionality
function initializeAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            const productPrice = this.closest('.product-card').querySelector('.text-lg').textContent;
            
            // Animate button
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.classList.add('bg-green-700');
            
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('bg-green-700');
            }, 1500);
            
            // Show notification
            showNotification(`${productName} added to cart for ${productPrice}`);
        });
    });
}

// View toggle functionality
function initializeViewToggle() {
    const gridView = document.getElementById('grid-view');
    const listView = document.getElementById('list-view');
    const productsGrid = document.getElementById('products-grid');
    
    gridView.addEventListener('click', function() {
        productsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        this.classList.add('text-green-600', 'bg-green-50');
        this.classList.remove('text-gray-400');
        listView.classList.remove('text-green-600', 'bg-green-50');
        listView.classList.add('text-gray-400');
    });

    listView.addEventListener('click', function() {
        productsGrid.className = 'grid grid-cols-1 gap-6';
        this.classList.add('text-green-600', 'bg-green-50');
        this.classList.remove('text-gray-400');
        gridView.classList.remove('text-green-600', 'bg-green-50');
        gridView.classList.add('text-gray-400');
    });
}

// Load more functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    
    loadMoreBtn.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = 'Loading...';
        this.disabled = true;
        this.classList.add('loading');
        
        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
            this.classList.remove('loading');
            showNotification('More products loaded!');
        }, 1500);
    });
}

// Newsletter subscription
function initializeNewsletter() {
    const subscribeBtn = document.getElementById('subscribe-btn');
    const emailInput = document.getElementById('newsletter-email');
    
    subscribeBtn.addEventListener('click', function() {
        const email = emailInput.value.trim();
        if (email && isValidEmail(email)) {
            showNotification(`Thank you for subscribing with ${email}!`);
            emailInput.value = '';
        } else {
            showNotification('Please enter a valid email address.');
        }
    });
    
    // Allow Enter key to submit
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            subscribeBtn.click();
        }
    });
}

// Filter functionality
function initializeFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterText = this.nextElementSibling.textContent;
            console.log('Filter applied:', filterText);
            // Here you would implement actual filtering logic
        });
    });
}

// Sort functionality
function initializeSort() {
    const sortDropdown = document.querySelector('.sort-dropdown');
    
    sortDropdown.addEventListener('change', function() {
        console.log('Sorting by:', this.value);
        showNotification(`Products sorted by ${this.value}`);
        // Here you would implement actual sorting logic
    });
}

// Price range functionality
function initializePriceRange() {
    const priceRange = document.querySelector('.price-range');
    
    priceRange.addEventListener('input', function() {
        const value = this.value;
        console.log('Price range:', value);
        // Here you would implement actual price filtering logic
    });
}

// Utility Functions

// Show notification function
function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debounce function for performance optimization
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

// Search functionality (if needed)
function initializeSearch() {
    const searchInput = document.querySelector('input[placeholder="Search products..."]');
    
    if (searchInput) {
        const debouncedSearch = debounce((searchTerm) => {
            console.log('Searching for:', searchTerm);
            // Implement search logic here
        }, 300);
        
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
    }
}

// Mobile menu toggle (if needed for responsive design)
function initializeMobileMenu() {
    // Add mobile menu functionality if needed
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeSmoothScrolling();
});

// Set active category link
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.category-nav-link');
    
    links.forEach(link => {
        if (currentPath.toLowerCase().includes(link.getAttribute('href').toLowerCase())) {
            link.classList.add('active');
        }
    });
});