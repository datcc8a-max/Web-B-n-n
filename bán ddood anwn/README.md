# Food Store - Cửa Hàng Bán Đồ Ăn

## 📖 Mô Tả
Giao diện website cơ bản cho cửa hàng bán đồ ăn trực tuyến. Website bao gồm các chức năng chính như hiển thị menu, lọc sản phẩm, thông tin liên hệ và biểu mẫu gửi tin nhắn.

## 🎯 Các Tính Năng

### 1. **Tiêu Đề & Điều Hướng (Header & Navigation)**
- Logo cửa hàng
- Menu điều hướng (Trang Chủ, Menu, Về Chúng Tôi, Liên Hệ)
- Biểu tượng tìm kiếm, giỏ hàng, và đăng nhập
- Thiết kế responsive với menu hamburger cho thiết bị di động

### 2. **Phần Hero (Hero Section)**
- Tiêu đề chính và slogan
- Nút "Đặt Hàng Ngay" để lấy sự chú ý của người dùng
- Gradient màu sắc bắt mắt

### 3. **Menu Sản Phẩm (Menu Section)**
- Lưới hiển thị các món ăn (8 sản phẩm mẫu)
- Các danh mục: Cơm, Phở & Mì, Snack, Thức Uống
- Lọc sản phẩm theo danh mục
- Hiển thị giá, mô tả, và nút "Thêm vào giỏ"
- Huy hiệu khuyến mãi

### 4. **Phần Về Chúng Tôi (About Section)**
- Giới thiệu cửa hàng
- Danh sách các ưu điểm
- Hình ảnh cửa hàng

### 5. **Liên Hệ (Contact Section)**
- Thông tin địa chỉ, điện thoại, email, giờ mở cửa
- Biểu mẫu gửi tin nhắn
- Liên kết đến mạng xã hội

### 6. **Footer**
- Thông tin cửa hàng
- Liên kết menu
- Liên kết mạng xã hội
- Bản quyền

## 📁 Cấu Trúc File

```
bán đô ăn/
├── index.html       # File HTML chính
├── style.css        # File CSS cho styling
├── script.js        # File JavaScript cho tương tác
└── README.md        # File hướng dẫn này
```

## 🚀 Cách Sử Dụng

1. **Mở website:**
   - Mở file `index.html` trực tiếp trong trình duyệt
   - Hoặc sử dụng Live Server trong VS Code

2. **Lọc sản phẩm:**
   - Nhấp vào các nút danh mục (Tất Cả, Cơm, Mì & Phở, Snack, Thức Uống)
   - Sản phẩm sẽ được lọc theo danh mục

3. **Thêm vào giỏ hàng:**
   - Nhấp nút "+" trên từng sản phẩm
   - Sẽ hiển thị thông báo xác nhận

4. **Gửi tin nhắn:**
   - Điền thông tin vào biểu mẫu Liên Hệ
   - Nhấp "Gửi Tin Nhắn"

5. **Trên thiết bị di động:**
   - Menu sẽ tự động thu gọn thành hamburger menu
   - Nhấp biểu tượng 3 dòng để mở menu

## 🎨 Tùy Chỉnh

### Thay đổi màu sắc
Chỉnh sửa các biến CSS trong `style.css`:
```css
:root {
    --primary-color: #FF6B35;      /* Màu chính */
    --secondary-color: #F7931E;    /* Màu phụ */
    --dark-color: #2D3436;         /* Màu tối */
    --light-color: #F5F5F5;        /* Màu nhạt */
}
```

### Thêm sản phẩm mới
Thêm HTML mới vào phần `.menu-grid` trong `index.html`:
```html
<div class="menu-item" data-category="rice">
    <div class="item-image">
        <img src="URL_HÌNH_ẢNH" alt="Tên sản phẩm">
        <span class="sale-badge">-15%</span>
    </div>
    <div class="item-info">
        <h3>Tên Sản Phẩm</h3>
        <p>Mô tả sản phẩm</p>
        <div class="item-footer">
            <span class="price">GIÁ ₫</span>
            <button class="btn-add"><i class="fas fa-plus"></i></button>
        </div>
    </div>
</div>
```

## 🔧 Các Thư Viện Sử Dụng

- **Font Awesome** - Biểu tượng (CDN)
- **Segoe UI Font** - Font chữ mặc định

## ⚡ Các Tính Năng JavaScript

- ✅ Lọc sản phẩm theo danh mục
- ✅ Thông báo toast khi thêm vào giỏ hàng
- ✅ Menu hamburger cho thiết bị di động
- ✅ Cuộn mượt đến các phần trang
- ✅ Hoạt ảnh xuất hiện khi cuộn trang
- ✅ Xử lý biểu mẫu liên hệ

## 📱 Responsive Design

Website được thiết kế để hoạt động tốt trên:
- 💻 Desktop (1200px trở lên)
- 📱 Tablet (768px - 1199px)
- 📲 Mobile (dưới 768px)

## 📝 Ghi Chú

- Hình ảnh sản phẩm sử dụng placeholder từ placeholder.com
- Bạn nên thay thế các hình ảnh này bằng hình ảnh thực tế
- Sửa thông tin liên hệ, giờ mở cửa, v.v. theo thông tin cửa hàng của bạn

## 🎓 Hướng Phát Triển Tiếp Theo

- [ ] Kết nối backend để lưu đơn hàng
- [ ] Thêm tính năng đăng nhập/đăng ký
- [ ] Tích hợp phương thức thanh toán
- [ ] Thêm chi tiết sản phẩm riêng
- [ ] Lịch sử mua hàng
- [ ] Hệ thống đánh giá sản phẩm
- [ ] Live chat hỗ trợ khách hàng

## 📄 License

Tự do sử dụng và chỉnh sửa cho mục đích cá nhân hoặc thương mại.

---

**Phiên bản:** 1.0  
**Cập nhật:** Tháng 6, 2024
