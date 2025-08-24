// Enhanced home button functionality with animation
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.querySelector('.back-button');
    
    if (backButton) {
        // Add click animation
        backButton.addEventListener('click', function(e) {
            // Add click effect
            this.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
});

