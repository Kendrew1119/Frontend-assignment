// Profile.js - Profile page functionality with authentication

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in by checking cookies
    if (!VerdraCookies.isSessionValid()) {
        window.location.href = 'Login.html';
        return;
    }

    // Get the user data from cookies
    const session = VerdraCookies.getUserSession();
    const currentUser = session.user;
    
    // Initialize profile with user data
    initializeProfile(currentUser);
    setupEventListeners();
    updateUserStats(currentUser);
});

function initializeProfile(user) {
    // Update profile welcome message
    const welcomeElement = document.querySelector('.profile-welcome');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome back, ${user.firstName || 'User'}!`;
    }

    // Update profile subtitle
    const subtitleElement = document.querySelector('.profile-subtitle');
    if (subtitleElement) {
        subtitleElement.textContent = `Manage your account and preferences below`;
    }

    // Update all info cards with user data
    updateInfoCard('Full Name', `${user.firstName || ''} ${user.lastName || ''}`);
    updateInfoCard('Gender', formatGender(user.gender));
    updateInfoCard('Phone Number', user.phone || 'N/A');
    updateInfoCard('Address', user.address || 'N/A');
    updateInfoCard('Postcode', user.postcode || 'N/A');
}

function updateInfoCard(label, value) {
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        const labelElement = card.querySelector('.info-label');
        if (labelElement && labelElement.textContent === label) {
            const valueElement = card.querySelector('.info-value');
            if (valueElement) {
                valueElement.textContent = value || 'N/A';
                
                // Add animation when updating
                valueElement.style.opacity = '0';
                setTimeout(() => {
                    valueElement.style.transition = 'opacity 0.3s ease';
                    valueElement.style.opacity = '1';
                }, 100);
            }
        }
    });
}

function formatGender(gender) {
    if (!gender) return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function updateUserStats(user) {
    // Get stats from cookies
    const orderCount = VerdraCookies.getUserData('userOrders')?.length || 0;
    const wishlistCount = VerdraCookies.getUserData('userWishlist')?.length || 0;
    const memberSince = user.createdAt ? calculateMembershipDuration(user.createdAt) : 'New';

    // Update stats display
    updateStatCard('Orders', orderCount);
    updateStatCard('Wishlist Items', wishlistCount);
    updateStatCard('Member Since', memberSince);
}

function updateStatCard(label, value) {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        const labelElement = item.querySelector('.stat-label');
        if (labelElement && labelElement.textContent === label) {
            const numberElement = item.querySelector('.stat-number');
            if (numberElement) {
                numberElement.textContent = value;
            }
        }
    });
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all cookies related to user session
        VerdraCookies.clearUserSession();
        
        // Redirect to login page without checking authentication
        window.location.replace('Login.html'); // Use replace instead of href
        return; // Ensure the function exits
    }
}

// Add this to your existing event listeners
function setupEventListeners() {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            switchSection(targetId);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Logout button
    const logoutBtn = document.querySelector('.LogoutButton');
    if (logoutBtn) {
        logoutBtn.onclick = handleLogout; // Use onclick instead of addEventListener
    }

    // Info cards hover effects
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });
    });

    // Add edit functionality (future feature)
    addEditFunctionality();
}

function switchSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.profile-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Handle different sections
    switch(sectionId) {
        case 'personal':
            // Personal info is already loaded
            break;
        case 'orders':
            loadOrderHistory();
            break;
        default:
            break;
    }
}

function loadOrderHistory() {
    // Create orders section if it doesn't exist
    let ordersSection = document.getElementById('orders');
    if (!ordersSection) {
        ordersSection = createOrdersSection();
        document.querySelector('.profile-main').appendChild(ordersSection);
    }

    const currentUser = VerdraAuth.getCurrentUser();
    const orders = VerdraCookies.getUserData(`orders_${currentUser.id}`) || [];

    if (orders.length === 0) {
        ordersSection.innerHTML = `
            <div class="section-header">
                <h2>Order History</h2>
            </div>
            <div class="empty-state">
                <div class="empty-icon">🛍️</div>
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet. Start shopping to see your order history here!</p>
                <a href="index.html" class="shop-now-btn">Start Shopping</a>
            </div>
        `;
    } else {
        // Display order history
        ordersSection.innerHTML = `
            <div class="section-header">
                <h2>Order History</h2>
                <p class="section-subtitle">View and track your recent orders</p>
            </div>
            <div class="orders-list">
                ${orders.map(order => createOrderCard(order)).join('')}
            </div>
        `;
    }
}

function createOrdersSection() {
    const section = document.createElement('div');
    section.id = 'orders';
    section.className = 'profile-section';
    return section;
}

function createOrderCard(order) {
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p class="order-date">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div class="order-status status-${order.status.toLowerCase()}">
                    ${order.status}
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                        <span class="item-price">RM${item.price}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Total: RM${order.total}</strong>
            </div>
        </div>
    `;
}

function addEditFunctionality() {
    // Add edit buttons to info cards (future feature)
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-info-btn';
        editBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        `;
        editBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(45, 80, 22, 0.1);
            border: none;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s ease;
            width: 32px;
            height: 32px;
        `;
        
        editBtn.querySelector('svg').style.cssText = `
            width: 16px;
            height: 16px;
            color: var(--primary-green);
        `;
        
        card.style.position = 'relative';
        card.appendChild(editBtn);
        
        // Show edit button on hover
        card.addEventListener('mouseenter', () => {
            editBtn.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            editBtn.style.opacity = '0';
        });
        
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Future: Implement edit functionality
            alert('Edit functionality coming soon!');
        });
    });
}

// Helper function to calculate membership duration
function calculateMembershipDuration(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return 'New';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m`;
    return `${Math.floor(diffDays / 365)}y`;
}
