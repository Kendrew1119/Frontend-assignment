document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.SearchButton');
    const searchPanel = document.getElementById('SearchPanel');
    const closeSearchButton = document.getElementById('CloseSearchButton');

    searchButton.addEventListener('click', () => {
        searchPanel.classList.add('active');
    });

    closeSearchButton.addEventListener('click', () => {
        searchPanel.classList.remove('active');
    });
});

searchButton.addEventListener('click', () => {
    searchPanel.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll
});

closeSearchButton.addEventListener('click', () => {
    searchPanel.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scroll
});