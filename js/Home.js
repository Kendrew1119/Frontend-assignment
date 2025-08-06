document.addEventListener('DOMContentLoaded', () => {
    
    // Search Bar functionality
    const searchButton = document.querySelector('.SearchButton');
    const searchPanel = document.getElementById('SearchPanel');
    const closeSearchButton = document.getElementById('CloseSearchButton');

    if (searchButton && searchPanel && closeSearchButton) {
        searchButton.addEventListener('click', () => {
            searchPanel.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
        });

        closeSearchButton.addEventListener('click', () => {
            searchPanel.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scroll
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
