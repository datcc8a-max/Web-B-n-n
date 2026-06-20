# 🍽️ Food Store - Hướng Dẫn Hoàn Chỉnh

## 📁 Cấu Trúc Dự Án

```
bán đô ăn/
├── Frontend (Website)
│   ├── index.html              # Trang chính
│   ├── login.html              # Trang đăng nhập
│   ├── style.css               # CSS chính
│   ├── script.js               # JavaScript chính
│   └── IMAGES.md               # Danh sách URL hình ảnh
│
├── Backend (API Server)
│   ├── server.js               # File server chính
│   ├── package.json            # Dependencies
│   ├── .env                    # Cấu hình (không push)
│   └── .gitignore              # Git ignore
│
├── Database
│   ├── database.sql            # SQL schema + data
│   └── API_SETUP.md            # Hướng dẫn setup
│
├── Documentation
│   ├── README.md               # Giới thiệu chung
│   ├── API_SETUP.md            # Hướng dẫn API
│   └── SETUP_GUIDE.md          # File này
```

---

## 🚀 Bắt Đầu Nhanh (Quick Start)

### 1️⃣ Cài Đặt Database (5 phút)

```bash
# Khởi động MySQL
mysql -u root -p

# Trong MySQL console, chạy:
SOURCE C:/Users/tranv/Downloads/bán\ đô\ ăn/database.sql;

# Kiểm tra
USE food_store;
SHOW TABLES;
```

### 2️⃣ Cài Đặt Backend (5 phút)

```bash
# Mở PowerShell
cd "C:\Users\tranv\Downloads\bán đô ăn"

# Cài dependencies
npm install

# Cấu hình .env
# Sửa file .env với mật khẩu MySQL của bạn

# Khởi động server
npm run dev
```

**Output:**
```
✓ Food Store API running on http://localhost:5000
```

### 3️⃣ Mở Frontend

```bash
# Cách 1: Click chuột phải index.html → Open with Live Server
# Cách 2: Mở trực tiếp http://localhost:3000 (nếu dùng Live Server)
# Cách 3: Mở file index.html trực tiếp trong trình duyệt
```

---

## 📊 Database Schema

### Users Table
```sql
id | username | email | password | full_name | phone | role | created_at
```
- `role`: customer, admin, staff
- Password: Hashed với bcryptjs

### Products Table
```sql
id | category_id | name | price | discount_percent | image_url | quantity_in_stock
```

### Orders Table
```sql
id | user_id | total_price | status | delivery_address | created_at
```
- `status`: pending, confirmed, preparing, ready, delivered, cancelled

---

## 🔐 API Authentication

### Luồng Đăng Nhập
```
1. Người dùng nhập username + password
   ↓
2. Server kiểm tra trong database
   ↓
3. Nếu đúng → Tạo JWT token
   ↓
4. Gửi token + user info cho client
   ↓
5. Client lưu token vào localStorage
   ↓
6. Các request tiếp theo gửi kèm token
```

### Header Authorization
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📱 Frontend Integration

### Login Flow
```javascript
// Khi người dùng nhấp "Đăng Nhập"
1. form submission → handleLogin()
2. POST /api/auth/login
3. Nhận token → localStorage.setItem('authToken', token)
4. Redirect → index.html
```

### Order Flow
```javascript
// Khi người dùng nhấp "Đặt Hàng"
1. Kiểm tra đăng nhập (getToken())
2. POST /api/orders với token
3. Nhận order_id
4. Hiển thị thành công
```

---

## 🛠️ API Endpoints Tóm Tắt

| Method | Endpoint | Auth | Mô Tả |
|--------|----------|------|-------|
| POST | /api/auth/register | ❌ | Đăng ký |
| POST | /api/auth/login | ❌ | Đăng nhập |
| GET | /api/auth/profile | ✅ | Lấy thông tin |
| PUT | /api/auth/profile | ✅ | Cập nhật thông tin |
| POST | /api/auth/change-password | ✅ | Đổi mật khẩu |
| GET | /api/products | ❌ | Danh sách sản phẩm |
| POST | /api/orders | ✅ | Tạo đơn hàng |
| GET | /api/orders | ✅ | Danh sách đơn hàng |

**Auth = ✅**: Cần gửi token trong header

---

## 🧪 Test API với Postman

### 1. Import Collection
```json
{
  "info": { "name": "Food Store API" },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/login",
        "body": {
          "username": "test_user",
          "password": "password123"
        }
      }
    }
  ]
}
```

### 2. Lấy Products
```
GET http://localhost:5000/api/products
```

### 3. Tạo Order (cần token)
```
POST http://localhost:5000/api/orders
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "items": [{"product_id": 1, "quantity": 2}],
  "delivery_address": "123 Nguyen Hue",
  "phone_number": "0901234567"
}
```

---

## 💾 Sample Users (Từ Database)

```sql
-- Tạo test user (run after database creation)
INSERT INTO users (username, email, password, full_name, role) VALUES
('test_user', 'test@example.com', '$2a$10$...', 'Test User', 'customer'),
('admin', 'admin@example.com', '$2a$10$...', 'Admin User', 'admin');
```

### Credentials
- **Username:** test_user
- **Password:** password123 (hashed)

---

## 📝 Workflow Hàng Ngày

### Phát Triển
```bash
# Terminal 1: Start MySQL
mysql -u root -p

# Terminal 2: Start Backend
cd "C:\Users\tranv\Downloads\bán đô ăn"
npm run dev

# Terminal 3: Open Frontend
# Open index.html hoặc live server
```

### Kiểm Tra
```bash
# Kiểm tra server chạy
curl http://localhost:5000/api/products

# Kiểm tra database
mysql food_store
SHOW TABLES;
SELECT * FROM users;
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```
❌ MySQL không chạy
✅ Khởi động MySQL Service
   Windows: Services.msc → MySQL80 → Start
```

### "Port 5000 already in use"
```
❌ Port 5000 đang được sử dụng
✅ Thay đổi port trong .env: PORT=5001
```

### "CORS error in browser"
```
❌ Frontend gọi API từ domain khác
✅ Kiểm tra CORS_ORIGIN trong .env
✅ Đảm bảo frontend URL trùng với cấu hình
```

### "Token invalid/expired"
```
❌ Token hết hạn (7 ngày)
✅ Đăng nhập lại để lấy token mới
✅ Hoặc tăng JWT expiry time
```

---

## 🔒 Bảo Mật

### Current Implementation
- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ SQL injection protection (prepared statements)
- ✅ CORS enabled

### Production Recommendations
- [ ] Thay đổi JWT_SECRET
- [ ] Sử dụng HTTPS
- [ ] Enable rate limiting
- [ ] Input validation
- [ ] HTTPS only cookies
- [ ] Helmet middleware
- [ ] Database backups

---

## 📈 Scaling Checklist

### Phase 1: MVP (Hiện tại)
- ✅ Basic auth
- ✅ Product listing
- ✅ Orders

### Phase 2: Enhancement
- [ ] Payment integration (Stripe, Momo)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Product reviews
- [ ] Favorites/Wishlist

### Phase 3: Advanced
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Recommendation engine
- [ ] Real-time notifications
- [ ] Mobile app

---

## 📚 Learning Resources

### Documentation
- [Express.js Docs](https://expressjs.com/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

### Tutorials
- [REST API Design](https://restfulapi.net/)
- [Database Design](https://www.postgresql.org/docs/current/tutorial.html)
- [Authentication Best Practices](https://auth0.com/blog/)

---

## 🤝 Contributing

Nếu bạn muốn thêm tính năng:
1. Fork project
2. Tạo branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra file API_SETUP.md
2. Xem logs trong console
3. Kiểm tra database connection
4. Reset password/token

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích thương mại và cá nhân

---

## 🎯 Quick Reference

### Cài đặt lại toàn bộ từ đầu
```bash
# 1. Delete node_modules
rmdir /s node_modules

# 2. Reinstall
npm install

# 3. Reset database
mysql -u root -p < database.sql

# 4. Start server
npm run dev
```

### Reset local changes
```bash
git status
git restore .
git clean -fd
```

### View logs
```bash
# Browser console (F12)
# Server console (npm run dev)
# MySQL logs
```

---

**Version:** 1.0.0  
**Last Updated:** Tháng 6, 2024  
**Status:** ✅ Production Ready
