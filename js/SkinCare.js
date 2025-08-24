// Price range display
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

if (priceRange) {
  priceRange.addEventListener("input", () => {
    priceValue.textContent = priceRange.value;
  });
}

// Apply filters
document.querySelector(".apply-filters-btn")?.addEventListener("click", () => {
  const selectedCategories = [...document.querySelectorAll(".filter-checkbox:checked")].map(cb => cb.value);
  const maxPrice = parseFloat(priceRange.value);

  document.querySelectorAll(".product-card").forEach(card => {
    const category = card.dataset.category;
    const price = parseFloat(card.dataset.price);

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
    const matchesPrice = price <= maxPrice;

    card.style.display = (matchesCategory && matchesPrice) ? "block" : "none";
  });
});

// Wishlist toggle (heart button)
document.querySelectorAll(".heart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const icon = btn.querySelector(".heart-icon");
    if (icon.classList.contains("filled")) {
      icon.classList.remove("filled");
      icon.setAttribute("fill", "none");
    } else {
      icon.classList.add("filled");
      icon.setAttribute("fill", "red"); // or any color you prefer
    }
  });
});
