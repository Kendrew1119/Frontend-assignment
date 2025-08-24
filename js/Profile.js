document.addEventListener('DOMContentLoaded', () => {
    // Search Bar functionality
    const searchButton = document.querySelector('.SearchButton');
    const searchPanel = document.getElementById('SearchPanel');
    const closeSearchButton = document.getElementById('CloseSearchButton');

    if (searchButton && searchPanel && closeSearchButton) {
        searchButton.addEventListener('click', () => {
            searchPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeSearchButton.addEventListener('click', () => {
            searchPanel.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Menu Dropdown functionality
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    let dropdownTimeout;

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
            menuDropdown.classList.add('show');
        });

        menuBtn.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                menuDropdown.classList.remove('show');
            }, 200);
        });

        menuDropdown.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
            menuDropdown.classList.add('show');
        });

        menuDropdown.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                menuDropdown.classList.remove('show');
            }, 200);
        });
    } else {
        console.log('Menu elements not found:', { menuBtn, menuDropdown });
    }

    // ============================
    // Wishlist Button Functionality
    // ============================
    const wishlistButtons = document.querySelectorAll('.SalesWishlistBtn');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.SalesItem');
            const productName = productCard.querySelector('.SalesName').textContent;
            const productPrice = productCard.querySelector('.SalesPrice').textContent;
            const productImage = productCard.querySelector('.SalesItemImage').src;

            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            // Check if item is already in wishlist
            const existingIndex = wishlist.findIndex(item => item.name === productName);

            if (existingIndex > -1) {
                // Remove if exists
                wishlist.splice(existingIndex, 1);
                button.classList.remove('active');
                alert(`Removed "${productName}" from wishlist.`);
            } else {
                // Add new item
                wishlist.push({ name: productName, price: productPrice, image: productImage });
                button.classList.add('active');
                alert(`Added "${productName}" to wishlist!`);
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    });
});

// Banner Auto Slide
let index = 0;
const track = document.getElementById('bannerTrack');
const dots = document.querySelectorAll('.dot');
const total = 4;
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
