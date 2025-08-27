document.addEventListener('DOMContentLoaded', () => {
    console.log('Noti.js: DOM loaded, checking authentication...');
    
    try {
        // Check if VerdraAuth is available
        if (typeof VerdraAuth === 'undefined') {
            console.error('Noti.js: VerdraAuth is not defined!');
            return;
        }
        
        // Check if VerdraCookies is available
        if (typeof VerdraCookies === 'undefined') {
            console.error('Noti.js: VerdraCookies is not defined!');
            return;
        }
        
        console.log('Noti.js: Authentication system available');
        
        if (!VerdraAuth.requireAuth()) {
            console.log('Noti.js: User not authenticated, redirecting...');
            return;
        }
        
        console.log('Noti.js: User authenticated, initializing...');
        
        // Enhanced home button functionality with animation
        const backButton = document.querySelector('.back-button');
        
        if (backButton) {
            console.log('Noti.js: Back button found, adding event listener');
            // Add click animation
            backButton.addEventListener('click', function(e) {
                // Add click effect
                this.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        } else {
            console.warn('Noti.js: Back button not found');
        }
        
        console.log('Noti.js: Initialization complete');
        
    } catch (error) {
        console.error('Noti.js: Error during initialization:', error);
    }
});

