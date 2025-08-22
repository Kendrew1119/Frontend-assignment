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