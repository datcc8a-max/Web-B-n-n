// ==================== User Authentication Manager ====================
// File: auth.js
// Thêm file này vào project và include trong HTML

// Constants
const API_URL = 'http://localhost:5000/api';

// ==================== Token Management ====================
class AuthManager {
    static saveToken(token) {
        localStorage.setItem('authToken', token);
    }

    static getToken() {
        return localStorage.getItem('authToken');
    }

    static removeToken() {
        localStorage.removeItem('authToken');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static logout() {
        this.removeToken();
        localStorage.removeItem('user');
    }
}

// ==================== API Calls ====================

// Đăng nhập
async function apiLogin(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return await response.json();
}

// Đăng ký
async function apiRegister(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return await response.json();
}

// Lấy thông tin cá nhân
async function apiGetProfile() {
    const token = AuthManager.getToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Cập nhật thông tin cá nhân
async function apiUpdateProfile(profileData) {
    const token = AuthManager.getToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });
    return await response.json();
}

// Đổi mật khẩu
async function apiChangePassword(oldPassword, newPassword) {
    const token = AuthManager.getToken();
    const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword
        })
    });
    return await response.json();
}

// Lấy danh sách sản phẩm
async function apiGetProducts(filters = {}) {
    let url = `${API_URL}/products`;
    const params = new URLSearchParams();

    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url);
    return await response.json();
}

// Tạo đơn hàng
async function apiCreateOrder(orderData) {
    const token = AuthManager.getToken();
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
    });
    return await response.json();
}

// Lấy danh sách đơn hàng
async function apiGetOrders() {
    const token = AuthManager.getToken();
    const response = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// ==================== UI Management ====================

// Cập nhật header khi đăng nhập
function updateHeaderUI() {
    const userIcon = document.querySelector('.icon-link:has(.fa-user)');
    if (!userIcon) return;

    if (AuthManager.isAuthenticated()) {
        const user = AuthManager.getUser();
        userIcon.innerHTML = `
            <div class="user-menu-trigger" style="cursor: pointer; position: relative;">
                <i class="fas fa-user-circle"></i>
                <div class="user-menu" style="display: none; position: absolute; top: 100%, right: 0; background: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); min-width: 200px; z-index: 1000;">
                    <div style="padding: 15px; border-bottom: 1px solid #eee;">
                        <p style="margin: 0; font-weight: 600;">${user.full_name || user.username}</p>
                        <p style="margin: 5px 0 0; font-size: 12px; color: #999;">${user.email}</p>
                    </div>
                    <a href="#" onclick="goToProfile(event)" style="display: block; padding: 10px 15px; color: #333; text-decoration: none; border-bottom: 1px solid #eee;">
                        👤 Thông tin cá nhân
                    </a>
                    <a href="#" onclick="goToOrders(event)" style="display: block; padding: 10px 15px; color: #333; text-decoration: none; border-bottom: 1px solid #eee;">
                        📦 Đơn hàng của tôi
                    </a>
                    <a href="#" onclick="handleLogout(event)" style="display: block; padding: 10px 15px; color: #FF6B35; text-decoration: none; font-weight: 600;">
                        🚪 Đăng xuất
                    </a>
                </div>
            </div>
        `;

        // Add event listener
        const trigger = userIcon.querySelector('.user-menu-trigger');
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = this.querySelector('.user-menu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        // Close menu on outside click
        document.addEventListener('click', function(e) {
            const menu = document.querySelector('.user-menu');
            if (menu) menu.style.display = 'none';
        });
    } else {
        userIcon.innerHTML = `
            <a href="login.html" title="Đăng nhập">
                <i class="fas fa-user"></i>
            </a>
        `;
    }
}

// Hiển thị nút đặt hàng (chỉ nếu đã đăng nhập)
function updateOrderButtonUI() {
    const orderButton = document.querySelector('.btn-primary');
    if (!orderButton) return;

    orderButton.addEventListener('click', function(e) {
        if (!AuthManager.isAuthenticated()) {
            e.preventDefault();
            if (confirm('Bạn cần đăng nhập để đặt hàng. Đi đến trang đăng nhập?')) {
                window.location.href = 'login.html';
            }
        }
    });
}

// Xử lý đăng xuất
function handleLogout(event) {
    event.preventDefault();
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        AuthManager.logout();
        showNotification('Đã đăng xuất thành công');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Chuyển đến trang cá nhân
function goToProfile(event) {
    event.preventDefault();
    window.location.href = 'profile.html';
}

// Chuyển đến trang đơn hàng
function goToOrders(event) {
    event.preventDefault();
    window.location.href = 'orders.html';
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
    // Update UI on page load
    updateHeaderUI();
    updateOrderButtonUI();

    // Redirect if not authenticated on protected pages
    const protectedPages = ['profile.html', 'orders.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
    }
});

// ==================== Shopping Cart ====================
class ShoppingCart {
    static getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static addItem(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += (product.quantity || 1);
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1
            });
        }

        this.saveCart(cart);
        this.updateCartCount();
        return cart;
    }

    static removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        this.updateCartCount();
        return cart;
    }

    static updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart(cart);
            this.updateCartCount();
        }
        return cart;
    }

    static clearCart() {
        localStorage.setItem('cart', JSON.stringify([]));
        this.updateCartCount();
    }

    static getTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    static updateCartCount() {
        const cart = this.getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartBadge = document.querySelector('.cart-count');
        if (cartBadge) {
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }
}

// Khởi tạo giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    ShoppingCart.updateCartCount();
});

// ==================== Notification Helper ====================
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${type === 'error' ? '#E74C3C' : '#27AE60'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
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

// ==================== Export for use ====================
// Sử dụng: AuthManager.getToken(), AuthManager.isAuthenticated(), etc.
// API calls: apiLogin(), apiRegister(), apiCreateOrder(), etc.
// Cart: ShoppingCart.addItem(), ShoppingCart.getCart(), etc.
