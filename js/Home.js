document.addEventListener('DOMContentLoaded', () => {
    // Search Bar functionality
    const searchButton = document.querySelector('.SearchButton');
    const searchPanel = document.getElementById('SearchPanel');

    if (searchButton && searchPanel) {
        searchButton.addEventListener('click', () => {
            searchPanel.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
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


//top sales add to wishlist and cart
function addToWishlist() {
  alert("Added to wishlist!");
}

function addToCart() {
  alert("Added to cart!");
}

function viewImage(img) {
  // e.g., open a modal or preview image
  alert("Image clicked: " + img.src);
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

//load products from JSON
fetch('js/Products.json')
    .then(response => response.json())
    .then(data => {
        const productContainer = document.querySelector('.ProductContainer');
        data.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'ProductCard';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onclick="viewImage(this)">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="price">$${product.price}</span>
                <button class="WishlistButton" onclick="addToWishlist()">Add to Wishlist</button>
                <button class="CartButton" onclick="addToCart()">Add to Cart</button>
            `;
            productContainer.appendChild(productCard);
        });
    })
    .catch(error => console.error('Error loading products:', error));

// Load New Arrivals
function loadNewArrivals() {
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const newArrivalsGrid = document.querySelector('.NewArrivalsGrid');
            if (!newArrivalsGrid) return;

            // Filter new arrival products and take first 5
            const newArrivals = products
                .filter(product => product.newArrival)
                .slice(0, 5);

            newArrivalsGrid.innerHTML = newArrivals.map(product => `
                <div class="NewArrivalItem" onclick="navigateToProduct(${product.id})">
                    <div class="NewArrivalImageContainer">
                        <img class="NewArrivalItemImage" src="${product.image}" alt="${product.name}">
                        <div class="NewArrivalBadge">New</div>
                        <button class="NewArrivalWishlistBtn" onclick="addToWishlist(event, ${product.id})">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="NewArrivalDetails">
                        <div class="NewArrivalBrand">Verdra</div>
                        <h3 class="NewArrivalName">${product.name}</h3>
                        <div class="NewArrivalPrice">RM${product.price.toFixed(2)}</div>
                        <button class="NewArrivalCartBtn" onclick="addToCart(event, ${product.id})">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        })
        .catch(err => console.error('Failed to load new arrivals:', err));
}

// Load Best Sellers
function loadBestSellers() {
    fetch('Products.json')
        .then(response => response.json())
        .then(products => {
            const salesGrid = document.querySelector('.SalesGrid');
            if (!salesGrid) return;

            // Filter products with sales > 500 and take first 5
            const bestSellers = products
                .filter(product => product.sales > 500)
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5);

            salesGrid.innerHTML = bestSellers.map(product => `
                <div class="SalesItem" onclick="navigateToProduct(${product.id})">
                    <div class="relative">
                        <div class="SalesImageContainer">
                            <img class="SalesItemImage" src="${product.image}" alt="${product.name}">
                        </div>
                        <button class="SalesWishlistBtn" onclick="addToWishlist(event, ${product.id})">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </button>
                        <div class="SalesBadge">Best Seller</div>
                    </div>
                    <div class="SalesDetails">
                        <div class="SalesBrand">Verdra</div>
                        <h3 class="SalesName">${product.name}</h3>
                        <div class="SalesRating">
                            ${'<svg class="SalesStarIcon" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>'.repeat(product.rating)}
                        </div>
                        <div class="SalesPriceRow">
                            <div class="SalesPriceGroup">
                                <span class="SalesPrice">RM${product.price.toFixed(2)}</span>
                            </div>
                            <button class="SalesCartBtn" onclick="addToCart(event, ${product.id})">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(err => console.error('Failed to load best sellers:', err));
}

// Navigation function
function navigateToProduct(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    window.location.href = `Product.html?id=${productId}`;
}

// Add to wishlist/cart functions
function addToWishlist(event, productId) {
    event.stopPropagation();
    alert("Added to wishlist!");
}

function addToCart(event, productId) {
    event.stopPropagation();
    alert("Added to cart!");
}