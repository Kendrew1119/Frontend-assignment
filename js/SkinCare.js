// js/main.js
document.addEventListener("DOMContentLoaded", function() {
    // ===== Price Range Slider =====
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");

    if (priceRange && priceValue) {
        // Update span when slider moves
        priceRange.addEventListener("input", function() {
            priceValue.textContent = this.value;
        });
    }

    // ===== Wishlist Heart Buttons =====
    const hearts = document.querySelectorAll('.heart-btn');

    hearts.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('filled');
        });
    });
});
