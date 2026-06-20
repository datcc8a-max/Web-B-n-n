// ==================== Admin Dashboard JavaScript ==================== 
// Requires auth.js to be included before this file

const API_URL = 'http://localhost:5000/api';

// Mock Data - Replace with API calls
const mockProducts = [
    { id: 1, name: 'Cơm Tấm Sườn Nạm', category: 'rice', price: 45000, quantity: 50, image: 'https://via.placeholder.com/100', discount: 10 },
    { id: 2, name: 'Phở Bò', category: 'noodles', price: 50000, quantity: 30, image: 'https://via.placeholder.com/100', discount: 0 },
    { id: 3, name: 'Bánh Mì Thập Cẩm', category: 'snacks', price: 35000, quantity: 40, image: 'https://via.placeholder.com/100', discount: 15 },
    { id: 4, name: 'Nước Cam Ép', category: 'drinks', price: 20000, quantity: 100, image: 'https://via.placeholder.com/100', discount: 0 },
];

const mockOrders = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', phone: '0123456789', total: 150000, status: 'pending', date: '2024-01-15', items: ['Cơm Tấm', 'Nước Cam'] },
    { id: 'ORD002', customer: 'Trần Thị B', phone: '0987654321', total: 200000, status: 'confirmed', date: '2024-01-14', items: ['Phở Bò', 'Bánh Mì'] },
    { id: 'ORD003', customer: 'Lê Văn C', phone: '0111111111', total: 120000, status: 'preparing', date: '2024-01-13', items: ['Cơm Tấm'] },
];

const mockCustomers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyen@email.com', phone: '0123456789', address: '123 Đường A, TP.HCM', orders: 5, spent: 500000 },
    { id: 2, name: 'Trần Thị B', email: 'tran@email.com', phone: '0987654321', address: '456 Đường B, TP.HCM', orders: 3, spent: 300000 },
    { id: 3, name: 'Lê Văn C', email: 'le@email.com', phone: '0111111111', address: '789 Đường C, TP.HCM', orders: 8, spent: 800000 },
];

let currentEditingProduct = null;

// ==================== Initialization ==================== 
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupEventListeners();
    loadDashboard();
    setupNavigation();
});

// ==================== Authentication Check ==================== 
function checkAuthentication() {
    if (!AuthManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = AuthManager.getUser();
    if (user && user.role !== 'admin') {
        alert('Chỉ admin mới có thể truy cập');
        AuthManager.logout();
        window.location.href = 'login.html';
    }

    if (user) {
        document.getElementById('admin-name').textContent = user.name || 'Admin';
    }
}

// ==================== Setup Event Listeners ==================== 
function setupEventListeners() {
    // Product form
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
    document.getElementById('product-discount').addEventListener('change', function() {
        document.getElementById('discount-group').style.display = 
            this.checked ? 'block' : 'none';
    });

    // Settings forms
    document.getElementById('store-settings-form').addEventListener('submit', handleStoreSettings);
    document.getElementById('delivery-settings-form').addEventListener('submit', handleDeliverySettings);
    document.getElementById('security-settings-form').addEventListener('submit', handleSecuritySettings);

    // Search and filter
    document.getElementById('product-search').addEventListener('input', filterProducts);
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('order-status-filter').addEventListener('change', filterOrders);
    document.getElementById('customer-search').addEventListener('input', filterCustomers);
    document.getElementById('search-input').addEventListener('input', handleGlobalSearch);
}

// ==================== Navigation ==================== 
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the section
            const sectionId = this.getAttribute('data-section');
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'products': 'Quản Lý Sản Phẩm',
                'orders': 'Quản Lý Đơn Hàng',
                'customers': 'Quản Lý Khách Hàng',
                'settings': 'Cài Đặt'
            };
            
            document.getElementById('page-title').textContent = titles[sectionId] || 'Dashboard';
            document.getElementById('page-subtitle').textContent = new Date().toLocaleDateString('vi-VN');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
                
                // Load data for the section
                if (sectionId === 'products') {
                    loadProducts();
                } else if (sectionId === 'orders') {
                    loadOrders();
                } else if (sectionId === 'customers') {
                    loadCustomers();
                }
            }
            
            closeSidebar();
        });
    });
}

// ==================== Sidebar Toggle (Mobile) ==================== 
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

// ==================== Dashboard ==================== 
function loadDashboard() {
    updateDashboardStats();
    loadRecentOrders();
}

function updateDashboardStats() {
    // Calculate stats from mock data
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = mockOrders.length;
    const totalProducts = mockProducts.reduce((sum, product) => sum + product.quantity, 0);
    const totalCustomers = mockCustomers.length;

    document.getElementById('total-revenue').textContent = 
        totalRevenue.toLocaleString('vi-VN') + ' VND';
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-customers').textContent = totalCustomers;
}

function loadRecentOrders() {
    const tbody = document.getElementById('recent-orders-body');
    tbody.innerHTML = '';

    mockOrders.slice(0, 5).forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.total.toLocaleString('vi-VN')} VND</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${order.date}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ Xử Lý',
        'confirmed': 'Đã Xác Nhận',
        'preparing': 'Đang Chuẩn Bị',
        'ready': 'Sẵn Sàng',
        'completed': 'Hoàn Thành',
        'cancelled': 'Hủy'
    };
    return statusMap[status] || status;
}

// ==================== Products Management ==================== 
function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';

    mockProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price.toLocaleString('vi-VN')} VND</td>
            <td>${product.quantity}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; border-radius: 5px;">
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openProductModal() {
    currentEditingProduct = null;
    document.getElementById('modal-title').textContent = 'Thêm Sản Phẩm Mới';
    document.getElementById('product-form').reset();
    document.getElementById('discount-group').style.display = 'none';
    document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function editProduct(id) {
    const product = mockProducts.find(p => p.id === id);
    if (!product) return;

    currentEditingProduct = product;
    document.getElementById('modal-title').textContent = 'Chỉnh Sửa Sản Phẩm';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = 'Mô tả sản phẩm';
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-quantity').value = product.quantity;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-discount').checked = product.discount > 0;
    document.getElementById('discount-group').style.display = 
        product.discount > 0 ? 'block' : 'none';
    document.getElementById('product-discount-percent').value = product.discount;
    
    document.getElementById('product-modal').classList.add('active');
}

function handleProductSubmit(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        price: parseInt(document.getElementById('product-price').value),
        quantity: parseInt(document.getElementById('product-quantity').value),
        image: document.getElementById('product-image').value,
        discount: document.getElementById('product-discount').checked ? 
            parseInt(document.getElementById('product-discount-percent').value) : 0
    };

    if (currentEditingProduct) {
        // Update existing product
        Object.assign(currentEditingProduct, productData);
        showNotification('Sản phẩm đã được cập nhật', 'success');
    } else {
        // Add new product
        productData.id = mockProducts.length + 1;
        mockProducts.push(productData);
        showNotification('Sản phẩm đã được thêm', 'success');
    }

    closeProductModal();
    loadProducts();
}

function deleteProduct(id) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        const index = mockProducts.findIndex(p => p.id === id);
        if (index > -1) {
            mockProducts.splice(index, 1);
            loadProducts();
            showNotification('Sản phẩm đã được xóa', 'success');
        }
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    const tbody = document.getElementById('products-table-body');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const category = row.cells[2].textContent;

        const matchSearch = name.includes(searchTerm);
        const matchCategory = !categoryFilter || category === categoryFilter;

        row.style.display = matchSearch && matchCategory ? '' : 'none';
    });
}

// ==================== Orders Management ==================== 
function loadOrders() {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';

    mockOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.phone}</td>
            <td>${order.total.toLocaleString('vi-VN')} VND</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${order.date}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="">Thay Đổi Trạng Thái</option>
                    <option value="pending">Chờ Xử Lý</option>
                    <option value="confirmed">Đã Xác Nhận</option>
                    <option value="preparing">Đang Chuẩn Bị</option>
                    <option value="ready">Sẵn Sàng</option>
                    <option value="completed">Hoàn Thành</option>
                    <option value="cancelled">Hủy</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewOrderDetails(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) return;

    const details = `
        <div style="margin-top: 20px;">
            <p><strong>ID Đơn:</strong> #${order.id}</p>
            <p><strong>Khách Hàng:</strong> ${order.customer}</p>
            <p><strong>Điện Thoại:</strong> ${order.phone}</p>
            <p><strong>Ngày Đặt:</strong> ${order.date}</p>
            <p><strong>Trạng Thái:</strong> <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></p>
            <hr>
            <h4>Sản Phẩm Đã Đặt:</h4>
            <ul>
                ${order.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <hr>
            <p style="font-size: 16px;"><strong>Tổng Tiền: ${order.total.toLocaleString('vi-VN')} VND</strong></p>
        </div>
    `;

    document.getElementById('order-details').innerHTML = details;
    document.getElementById('order-modal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

function updateOrderStatus(orderId, status) {
    if (!status) return;
    
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        loadOrders();
        showNotification('Trạng thái đơn hàng đã được cập nhật', 'success');
    }
}

function filterOrders() {
    const statusFilter = document.getElementById('order-status-filter').value;
    const tbody = document.getElementById('orders-table-body');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        const status = row.cells[4].querySelector('.status-badge').classList[1]?.replace('status-', '') || '';
        const display = !statusFilter || status === statusFilter ? '' : 'none';
        row.style.display = display;
    });
}

// ==================== Customers Management ==================== 
function loadCustomers() {
    const tbody = document.getElementById('customers-table-body');
    tbody.innerHTML = '';

    mockCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>${customer.orders}</td>
            <td>${customer.spent.toLocaleString('vi-VN')} VND</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewCustomerDetails(${customer.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${customer.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewCustomerDetails(id) {
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) return;

    alert(`
Tên: ${customer.name}
Email: ${customer.email}
Điện Thoại: ${customer.phone}
Địa Chỉ: ${customer.address}
Số Đơn Hàng: ${customer.orders}
Tổng Chi Tiêu: ${customer.spent.toLocaleString('vi-VN')} VND
    `);
}

function deleteCustomer(id) {
    if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
        const index = mockCustomers.findIndex(c => c.id === id);
        if (index > -1) {
            mockCustomers.splice(index, 1);
            loadCustomers();
            showNotification('Khách hàng đã được xóa', 'success');
        }
    }
}

function filterCustomers() {
    const searchTerm = document.getElementById('customer-search').value.toLowerCase();
    const tbody = document.getElementById('customers-table-body');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        const phone = row.cells[3].textContent.toLowerCase();

        const match = name.includes(searchTerm) || 
                     email.includes(searchTerm) || 
                     phone.includes(searchTerm);

        row.style.display = match ? '' : 'none';
    });
}

// ==================== Settings ==================== 
function handleStoreSettings(e) {
    e.preventDefault();
    const storeData = {
        name: document.getElementById('store-name').value,
        email: document.getElementById('store-email').value,
        phone: document.getElementById('store-phone').value,
        address: document.getElementById('store-address').value
    };
    localStorage.setItem('storeSettings', JSON.stringify(storeData));
    showNotification('Cài đặt cửa hàng đã được lưu', 'success');
}

function handleDeliverySettings(e) {
    e.preventDefault();
    const deliveryData = {
        fee: document.getElementById('delivery-fee').value,
        time: document.getElementById('delivery-time').value,
        openingTime: document.getElementById('opening-time').value,
        closingTime: document.getElementById('closing-time').value
    };
    localStorage.setItem('deliverySettings', JSON.stringify(deliveryData));
    showNotification('Cài đặt giao hàng đã được lưu', 'success');
}

function handleSecuritySettings(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
    }

    showNotification('Mật khẩu đã được thay đổi', 'success');
    document.getElementById('security-settings-form').reset();
}

// ==================== Global Search ==================== 
function handleGlobalSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // This would search across all sections
    // For now, it just shows a notification
    if (searchTerm.length > 2) {
        console.log('Searching for:', searchTerm);
    }
}

// ==================== Notifications ==================== 
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification active ${type}`;

    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// ==================== Logout ==================== 
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        AuthManager.logout();
        window.location.href = 'login.html';
    }
}

// ==================== Helper Functions ==================== 
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const productModal = document.getElementById('product-modal');
    const orderModal = document.getElementById('order-modal');

    if (e.target === productModal) {
        closeProductModal();
    }
    if (e.target === orderModal) {
        closeOrderModal();
    }
});

// Add status select styles
const style = document.createElement('style');
style.textContent = `
    .status-select {
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
    }
`;
document.head.appendChild(style);
