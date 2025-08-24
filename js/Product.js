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
});

// Add to cart functionality
function addToCart() {
    const quantity = document.getElementById('quantity').value;
    alert(`Added ${quantity} item(s) to cart`);
}