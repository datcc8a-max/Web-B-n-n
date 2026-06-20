// ==================== Menu Filtering ==================== 
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get selected filter
        const filter = this.getAttribute('data-filter');
        
        // Filter menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 0);
            } else {
                if (item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 0);
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            }
        });
    });
});

// ==================== Hamburger Menu ==================== 
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ==================== Add to Cart ==================== 
document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', function() {
        const itemName = this.closest('.menu-item').querySelector('h3').textContent;
        const itemPrice = this.closest('.menu-item').querySelector('.price').textContent;
        
        // Show toast notification
        showNotification(`${itemName} đã được thêm vào giỏ hàng!`);
        
        // Animation effect
        this.style.transform = 'scale(1.3)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// ==================== Toast Notification ==================== 
function showNotification(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #27AE60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== Add Animation Styles ==================== 
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Contact Form ==================== 
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Validate
        if (name && email && message) {
            showNotification(`Cảm ơn ${name}! Chúng tôi sẽ liên hệ lại với bạn sớm.`);
            this.reset();
        } else {
            showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        }
    });
}

// ==================== Scroll Animation ==================== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.5s ease';
    observer.observe(item);
});

// ==================== Smooth Scroll for Mobile ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== Search functionality (placeholder) ==================== 
const searchIcon = document.querySelector('a[href="#"] .fa-search');
if (searchIcon) {
    searchIcon.parentElement.addEventListener('click', function(e) {
        e.preventDefault();
        const searchTerm = prompt('Tìm kiếm món ăn:');
        if (searchTerm) {
            showNotification(`Đang tìm kiếm: ${searchTerm}`);
        }
    });
}

// ==================== Cart Counter (Demo) ==================== 
let cartCount = 0;
const cartIcon = document.querySelector('a[href="#"] .fa-shopping-cart');
if (cartIcon) {
    cartIcon.parentElement.addEventListener('click', function(e) {
        e.preventDefault();
        if (cartCount === 0) {
            showNotification('Giỏ hàng của bạn đang trống');
        } else {
            showNotification(`Giỏ hàng có ${cartCount} sản phẩm`);
        }
    });
}

// Update cart count when adding items
document.querySelectorAll('.btn-add').forEach(button => {
    button.addEventListener('click', function() {
        cartCount++;
    });
});

console.log('Food Store - Website loaded successfully!');
