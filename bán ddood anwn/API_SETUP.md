# 🍔 Food Store - API & Database Setup Guide

## 📋 Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt Database](#cài-đặt-database)
3. [Cài Đặt Backend](#cài-đặt-backend)
4. [API Endpoints](#api-endpoints)
5. [Sử Dụng API](#sử-dụng-api)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Yêu Cầu Hệ Thống

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MySQL** v5.7+ hoặc **MariaDB** ([Download](https://dev.mysql.com/downloads/))
- **npm** (đi kèm với Node.js)
- **Postman** (optional, để test API)

### Kiểm tra cài đặt:
```bash
node --version
npm --version
mysql --version
```

---

## 🗄️ Cài Đặt Database

### Bước 1: Khởi động MySQL
```bash
# Windows
mysql -u root -p

# macOS/Linux
sudo mysql -u root -p
```

### Bước 2: Chạy SQL Script
```sql
-- Chạy toàn bộ file database.sql
SOURCE C:/path/to/database.sql;
```

Hoặc copy toàn bộ nội dung từ `database.sql` và paste vào MySQL console.

### Bước 3: Kiểm tra cơ sở dữ liệu
```sql
USE food_store;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM products;
```

---

## 🚀 Cài Đặt Backend

### Bước 1: Cài Đặt Dependencies
```bash
cd "c:\Users\tranv\Downloads\bán đô ăn"
npm install
```

Điều này sẽ cài đặt:
- `express` - Web framework
- `mysql2` - Driver MySQL
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Bước 2: Cấu Hình File .env
Mở file `.env` và điều chỉnh:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password     # Thay với password MySQL của bạn
DB_NAME=food_store
PORT=5000
JWT_SECRET=your_super_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### Bước 3: Khởi Động Server
```bash
# Chế độ development (tự động reload)
npm run dev

# Hoặc chế độ production
npm start
```

**Output mong đợi:**
```
✓ Food Store API running on http://localhost:5000
Endpoints available:
  POST   /api/auth/register
  POST   /api/auth/login
  ...
```

---

## 📡 API Endpoints

### 🔐 Authentication

#### 1. Đăng Ký Tài Khoản
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "0901234567"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Đăng ký tài khoản thành công",
  "user_id": 1
}
```

---

#### 2. Đăng Nhập
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "customer"
  }
}
```

---

#### 3. Lấy Thông Tin Người Dùng
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "0901234567",
    "address": "123 Nguyen Hue, HCMC",
    "role": "customer",
    "avatar_url": null,
    "created_at": "2024-06-13T10:30:00.000Z"
  }
}
```

---

#### 4. Cập Nhật Thông Tin Người Dùng
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "phone": "0909999999",
  "address": "456 Tran Hung Dao, HCMC",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công"
}
```

---

#### 5. Đổi Mật Khẩu
**POST** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "old_password": "password123",
  "new_password": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công"
}
```

---

### 🍽️ Products

#### 6. Danh Sách Sản Phẩm
**GET** `/api/products`

**Query Parameters:**
- `category_id` (optional): ID danh mục
- `search` (optional): Tìm kiếm theo tên
- `limit` (optional): Số lượng sản phẩm (mặc định 10)
- `offset` (optional): Bỏ qua n sản phẩm (mặc định 0)

**Examples:**
```
GET /api/products?category_id=1&limit=5
GET /api/products?search=phở
GET /api/products?limit=20&offset=10
```

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Cơm Tấm Sườn",
      "description": "Cơm tấm nóng kèm sườn nướng",
      "price": 35000,
      "discount_percent": 15,
      "discounted_price": 29750,
      "image_url": "https://...",
      "quantity_in_stock": 50,
      "category_id": 1,
      "category_name": "Cơm & Cơm Tấm",
      "created_at": "2024-06-13T10:00:00.000Z"
    },
    ...
  ],
  "count": 10
}
```

---

### 📦 Orders

#### 7. Tạo Đơn Hàng
**POST** `/api/orders`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ],
  "delivery_address": "123 Nguyen Hue, HCMC",
  "phone_number": "0901234567",
  "notes": "Giao hàng trước 12h trưa"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo đơn hàng thành công",
  "order_id": 5,
  "total_price": 80000
}
```

---

#### 8. Danh Sách Đơn Hàng
**GET** `/api/orders`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": 5,
      "user_id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "total_price": 80000,
      "status": "pending",
      "item_count": 2,
      "created_at": "2024-06-13T15:30:00.000Z"
    },
    ...
  ]
}
```

---

## 💻 Sử Dụng API

### Option 1: Postman

1. Tải [Postman](https://www.postman.com/downloads/)
2. Import collection (hoặc tạo requests thủ công)
3. Thực hiện requests

### Option 2: cURL

```bash
# Đăng nhập
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'

# Lấy thông tin người dùng
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Lấy danh sách sản phẩm
curl -X GET http://localhost:5000/api/products?limit=10
```

### Option 3: JavaScript/Fetch API

```javascript
// Đăng nhập
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;

// Lấy thông tin người dùng
const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const profile = await profileResponse.json();
console.log(profile);
```

---

## 🔗 Tích Hợp Frontend

### Thêm vào file `script.js` của website:

```javascript
// API Base URL
const API_URL = 'http://localhost:5000/api';

// Lưu token
function saveToken(token) {
  localStorage.setItem('authToken', token);
}

function getToken() {
  return localStorage.getItem('authToken');
}

function removeToken() {
  localStorage.removeItem('authToken');
}

// Đăng nhập
async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  if (data.success) {
    saveToken(data.token);
    return data.user;
  }
  throw new Error(data.message);
}

// Tạo đơn hàng
async function createOrder(items, delivery_address, phone_number) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ items, delivery_address, phone_number })
  });
  
  return await response.json();
}
```

---

## ⚠️ Troubleshooting

### Lỗi: "Cannot find module 'express'"
```bash
npm install
```

### Lỗi: "Connect ECONNREFUSED 127.0.0.1:3306"
- Kiểm tra MySQL đang chạy
- Kiểm tra DB_HOST, DB_USER, DB_PASSWORD trong .env

### Lỗi: "Access denied for user 'root'@'localhost'"
- Cập nhật mật khẩu MySQL trong .env
- Hoặc reset MySQL root password

### Lỗi: "database 'food_store' doesn't exist"
- Chạy lại file database.sql
- Hoặc chạy: `CREATE DATABASE food_store;`

### Token không hợp lệ
- Đảm bảo token được gửi trong header: `Authorization: Bearer TOKEN`
- Kiểm tra token chưa hết hạn (7 ngày)

### CORS Error
- Kiểm tra CORS_ORIGIN trong .env
- Thêm frontend URL vào CORS whitelist trong server.js

---

## 📚 Database Schema

**Tables:**
- `users` - Thông tin người dùng
- `categories` - Danh mục sản phẩm
- `products` - Danh sách sản phẩm
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `reviews` - Đánh giá sản phẩm
- `favorites` - Sản phẩm yêu thích

**Views:**
- `product_details` - Thông tin sản phẩm chi tiết
- `order_summary` - Tóm tắt đơn hàng
- `user_purchases` - Tổng số đơn hàng người dùng

---

## 🔐 Bảo Mật

1. **Password Hashing**: Sử dụng bcryptjs
2. **JWT Token**: Hết hạn sau 7 ngày
3. **SQL Injection Protection**: Sử dụng prepared statements
4. **CORS**: Chỉ cho phép origins được phép
5. **Environment Variables**: Không commit .env file

---

## 📝 Ghi Chú Quan Trọng

1. Thay đổi `JWT_SECRET` trong production
2. Sử dụng HTTPS trong production
3. Backup database định kỳ
4. Giám sát logs server
5. Rate limiting nên được thêm vào

---

**Phiên bản:** 1.0  
**Cập nhật:** Tháng 6, 2024
