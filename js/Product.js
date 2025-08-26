document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'NewArrival.html';
        return;
    }

    // Fetch product details
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === parseInt(productId));
            
            if (!product) {
                window.location.href = 'NewArrival.html';
                return;
            }

            // Update product details
            document.querySelector('.ProductTitle').textContent = product.name;
            document.querySelector('.ProductDescription').textContent = product.description;
            document.querySelector('.ProductPrice').textContent = `RM ${product.price.toFixed(2)}`;
            document.querySelector('.ProductImage img').src = product.image;
            document.querySelector('.ProductImage img').alt = product.name;
            
            // Update rating
            document.querySelector('.ProductRating span').textContent = `⭐ ${product.rating}`;
            document.querySelector('.RatingCount').textContent = `(${product.sales} reviews)`;

            // Update breadcrumb
            document.querySelector('.category-breadcrumb').textContent = product.category;
            
            // Update page title
            document.title = `${product.name} - Verdra`;
        })
        .catch(err => {
            console.error('Failed to load product:', err);
            window.location.href = 'NewArrival.html';
        });

    // Add event listener for Add to Bag button
    const addToBagBtn = document.querySelector('.AddToBag');
    if (addToBagBtn) {
        addToBagBtn.addEventListener('click', handleAddToBag);
    }
});

// Handle Add to Bag functionality
function handleAddToBag() {
    if (!VerdraAuth.isLoggedIn()) {
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const quantity = parseInt(document.getElementById('quantity').value) || 1;

    if (!productId) {
        showAlert('Product not found!', 'error');
        return;
    }

    // Fetch product details and add to cart
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === parseInt(productId));
            if (product) {
                // Create cart item with quantity
                const cartItem = {
                    ...product,
                    quantity: quantity
                };
                
                VerdraAuth.addToUserCart(cartItem);
                
                // Show success animation
                const btn = document.querySelector('.AddToBag');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Added!';
                btn.style.background = '#4a7c59';
                
                setTimeout(() => {
                    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> Add to Bag';
                    btn.style.background = '';
                }, 2000);
                
                showAlert(`Added ${quantity} item(s) to cart!`, 'success');
            }
        })
        .catch(err => {
            console.error('Failed to add to cart:', err);
            showAlert('Failed to add to cart. Please try again.', 'error');
        });
}

// Change main product image
function changeMainImage(src) {
    document.getElementById('mainProductImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    event.target.classList.add('active');
}

// Handle wishlist click
function handleWishlistClick() {
    if (!VerdraAuth.isLoggedIn()) {
        window.location.href = 'Login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }

    const btn = event.target.closest('.ProductWishlistBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) return;

    // Fetch product and add to wishlist
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === parseInt(productId));
            if (product) {
                if (VerdraAuth.addToUserWishlist(product)) {
                    btn.classList.add('liked');
                    btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21C12 21 4 13.667 4 8.5C4 5.462 6.462 3 12.91 4.058 13.5 5.355C14.09 4.058 15.76 3 17.5 3C20.538 3 23 5.462 23 8.5C23 13.667 15 21 15 21H12Z"/></svg>';
                    showAlert('Added to wishlist!', 'success');
                } else {
                    btn.classList.remove('liked');
                    btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21C12 21 4 13.667 4 8.5C4 5.462 6.462 3 12.91 4.058 13.5 5.355C14.09 4.058 15.76 3 17.5 3C20.538 3 23 5.462 23 8.5C23 13.667 15 21 15 21H12Z"/></svg>';
                    showAlert('Removed from wishlist', 'info');
                }
            }
        })
        .catch(err => {
            console.error('Failed to update wishlist:', err);
            showAlert('Failed to update wishlist. Please try again.', 'error');
        });
}

// Update quantity
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    let newValue = currentValue + change;
    
    if (newValue < 1) newValue = 1;
    quantityInput.value = newValue;
}

// Show tab content
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Handle variant selection
document.querySelectorAll('.variant-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const price = this.getAttribute('data-price');
        document.querySelector('.ProductPrice').textContent = `RM ${price}`;
    });
});

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