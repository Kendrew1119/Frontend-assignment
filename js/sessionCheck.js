(function() {
    const publicPages = ['Login.html', 'SignUp.html', 'Home.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (!publicPages.includes(currentPage) && !VerdraAuth.isLoggedIn()) {
        window.location.replace('Login.html');
    }
})();