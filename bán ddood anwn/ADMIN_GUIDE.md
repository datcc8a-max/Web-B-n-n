# ADMIN DASHBOARD - Hướng Dẫn Sử Dụng

## 📋 Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Các Tính Năng](#các-tính-năng)
3. [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
4. [Tích Hợp API](#tích-hợp-api)

---

## 🎯 Giới Thiệu

**Admin Dashboard** là giao diện quản lý toàn bộ hệ thống cửa hàng bán đồ ăn. Nó cung cấp các công cụ mạnh mẽ để quản lý sản phẩm, đơn hàng, khách hàng và cài đặt cửa hàng.

### Yêu Cầu
- Tài khoản admin với role `admin`
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- JavaScript được bật
- Kết nối đến API backend

---

## ✨ Các Tính Năng

### 1. **Dashboard (Bảng Điều Khiển)**
- 📊 Hiển thị thống kê tổng quát:
  - Tổng doanh thu
  - Số đơn hàng
  - Số sản phẩm
  - Số khách hàng
- 📈 Biểu đồ doanh thu theo tuần
- 📋 Danh sách đơn hàng gần đây
- 🎯 Danh mục phổ biến

### 2. **Quản Lý Sản Phẩm**
- ➕ Thêm sản phẩm mới
- ✏️ Chỉnh sửa sản phẩm
- ❌ Xóa sản phẩm
- 🔍 Tìm kiếm sản phẩm
- 📂 Lọc theo danh mục (Cơm, Phở & Mì, Snack, Thức Uống)
- 💰 Quản lý giá và khuyến mãi
- 📦 Theo dõi số lượng tồn kho

### 3. **Quản Lý Đơn Hàng**
- 📋 Xem danh sách tất cả đơn hàng
- 👁️ Xem chi tiết đơn hàng
- 🔄 Cập nhật trạng thái đơn hàng:
  - Chờ Xử Lý
  - Đã Xác Nhận
  - Đang Chuẩn Bị
  - Sẵn Sàng
  - Hoàn Thành
  - Hủy
- 🔍 Lọc theo trạng thái
- 📊 Xem thông tin khách hàng và tổng tiền

### 4. **Quản Lý Khách Hàng**
- 👥 Danh sách tất cả khách hàng
- 🔍 Tìm kiếm khách hàng
- 📞 Xem thông tin liên hệ
- 📍 Xem địa chỉ giao hàng
- 💰 Xem lịch sử chi tiêu
- 📦 Xem số đơn hàng

### 5. **Cài Đặt**
- 🏪 Thông tin cửa hàng (tên, email, điện thoại, địa chỉ)
- 🚚 Cài đặt giao hàng (phí, thời gian, giờ hoạt động)
- 🔐 Quản lý bảo mật (thay đổi mật khẩu)

---

## 🚀 Hướng Dẫn Sử Dụng

### Đăng Nhập
1. Mở file `login.html`
2. Nhập tài khoản admin
3. Nhấp "Đăng Nhập"
4. Tự động chuyển hướng đến `admin.html`

### Sử Dụng Dashboard
1. Trang chủ hiển thị tổng quan doanh kinh doanh
2. Kiểm tra thống kê và đơn hàng gần đây

### Thêm Sản Phẩm
1. Vào tab "Quản Lý Sản Phẩm"
2. Nhấp nút "+ Thêm Sản Phẩm"
3. Điền thông tin:
   - Tên sản phẩm
   - Mô tả
   - Danh mục
   - Giá
   - Số lượng
   - URL hình ảnh
   - (Optional) Khuyến mãi
4. Nhấp "Lưu Sản Phẩm"

### Chỉnh Sửa Sản Phẩm
1. Tìm sản phẩm trong bảng
2. Nhấp biểu tượng ✏️ (Edit)
3. Cập nhật thông tin
4. Nhấp "Lưu Sản Phẩm"

### Xóa Sản Phẩm
1. Tìm sản phẩm trong bảng
2. Nhấp biểu tượng 🗑️ (Delete)
3. Xác nhận xóa

### Quản Lý Đơn Hàng
1. Vào tab "Quản Lý Đơn Hàng"
2. Xem danh sách đơn hàng
3. Nhấp 👁️ để xem chi tiết
4. Thay đổi trạng thái từ dropdown
5. Hệ thống tự động cập nhật

### Tìm Kiếm & Lọc
- **Sản phẩm**: Nhập tên sản phẩm hoặc chọn danh mục
- **Đơn hàng**: Chọn trạng thái từ dropdown
- **Khách hàng**: Nhập tên, email hoặc số điện thoại

### Cài Đặt Cửa Hàng
1. Vào tab "Cài Đặt"
2. Cập nhật thông tin phù hợp
3. Nhấp "Lưu Cài Đặt" ở mỗi phần

---

## 🔌 Tích Hợp API

### Cấu Trúc File
```
admin/
├── admin.html       # Giao diện chính
├── admin.css        # Styling
├── admin.js         # Logic và xử lý sự kiện
├── auth.js          # Quản lý xác thực
└── ADMIN_GUIDE.md   # Tài liệu này
```

### Cấu Hình API
Thay đổi URL API trong file `admin.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
```

### Endpoints API Cần Thiết

#### Sản Phẩm
```
GET    /api/products           - Lấy danh sách sản phẩm
POST   /api/products           - Thêm sản phẩm
PUT    /api/products/:id       - Cập nhật sản phẩm
DELETE /api/products/:id       - Xóa sản phẩm
```

#### Đơn Hàng
```
GET    /api/orders             - Lấy danh sách đơn hàng
GET    /api/orders/:id         - Xem chi tiết đơn hàng
PUT    /api/orders/:id/status  - Cập nhật trạng thái
```

#### Khách Hàng
```
GET    /api/customers          - Lấy danh sách khách hàng
GET    /api/customers/:id      - Xem chi tiết khách hàng
DELETE /api/customers/:id      - Xóa khách hàng
```

#### Cài Đặt
```
GET    /api/settings           - Lấy cài đặt
PUT    /api/settings           - Cập nhật cài đặt
```

### Ví Dụ: Tích Hợp API Sản Phẩm

Thay đổi hàm `loadProducts()` trong `admin.js`:

```javascript
async function loadProducts() {
    try {
        const token = AuthManager.getToken();
        const response = await fetch(`${API_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        const products = data.data; // Hoặc data.products tùy API
        
        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = '';

        products.forEach(product => {
            // Tạo row HTML cho mỗi sản phẩm
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price.toLocaleString('vi-VN')} VND</td>
                <td>${product.quantity}</td>
                <td>
                    <img src="${product.image}" alt="${product.name}" 
                         style="width: 40px; height: 40px; border-radius: 5px;">
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" 
                            onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" 
                            onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Lỗi khi tải sản phẩm', 'error');
    }
}
```

### Lưu Ý
- Luôn kiểm tra token xác thực trước khi gửi request
- Xử lý lỗi một cách phù hợp
- Hiển thị notification khi có thay đổi
- Refresh dữ liệu sau khi thành công

---

## 🎨 Tùy Chỉnh Giao Diện

### Màu Sắc
Chỉnh sửa các biến CSS trong `admin.css`:

```css
:root {
    --primary-color: #FF6B35;        /* Màu chính */
    --secondary-color: #F7931E;      /* Màu phụ */
    --dark-color: #2D3436;           /* Màu tối */
    --light-color: #F5F5F5;          /* Màu sáng */
    --success-color: #27AE60;        /* Thành công */
    --danger-color: #E74C3C;         /* Lỗi/Nguy hiểm */
}
```

### Responsive Design
- Desktop: Toàn bộ giao diện
- Tablet (< 1024px): Grid tự động giảm cột
- Mobile (< 768px): Sidebar ẩn, menu hamburger
- Phone (< 480px): Tối ưu hóa cho màn hình nhỏ

---

## ⚙️ Troubleshooting

### Lỗi: "Chỉ admin mới có thể truy cập"
- Kiểm tra role người dùng trong API
- Đảm bảo token chứa thông tin role
- Cập nhật auth.js để đọc role đúng

### Lỗi: "Dữ liệu không tải"
- Kiểm tra kết nối API
- Xem console (F12) để xem lỗi
- Đảm bảo CORS được bật trên server
- Kiểm tra token có hợp lệ không

### Hiệu Suất Chậm
- Tối ưu hóa số lượng bản ghi trên mỗi trang (pagination)
- Sử dụng caching cho dữ liệu thường dùng
- Giảm kích thước hình ảnh
- Sử dụng lazy loading

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Xem logs của server backend
3. Liên hệ đội phát triển

---

**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2024-01-15  
**Tác giả**: Food Store Team
