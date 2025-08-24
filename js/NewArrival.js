document.addEventListener('DOMContentLoaded', () => {
    fetch('https://mocki.io/v1/e7ef4a26-9051-4620-878e-70e41e518095')
        .then(response => response.json())
        .then(products => {
            const grid = document.querySelector('.ProductsGrid');
            if (!grid) return;
            grid.innerHTML = '';
            products
                .filter(product => product.newArrival)
                .forEach(product => {
                    grid.innerHTML += `
                        <div class="ProductItem" data-category="${product.category ? product.category.toLowerCase() : ''}">
                            <div class="ProductImageContainer">
                                <img class="ProductImage" src="${product.image}" alt="${product.name}">
                                <div class="ProductBadge">New</div>
                                <button class="ProductWishlistBtn" onclick="addToWishlist()">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                </button>
                                <div class="ProductOverlay">
                                    <button class="QuickViewBtn">Quick View</button>
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
                                    <button class="ProductCartBtn" onclick="addToCart()">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
        })
        .catch(err => console.error('Failed to load products:', err));
});

// Dummy functions for wishlist/cart
function addToWishlist() {
    alert("Added to wishlist!");
}
function addToCart() {
    alert("Added to cart!");
}