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

// Add to wishlist/cart functions
function addToWishlist(event, productId) {
    event.stopPropagation();
    alert("Added to wishlist!");
}

function addToCart(event, productId) {
    event.stopPropagation();
    alert("Added to cart!");
}