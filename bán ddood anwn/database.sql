-- Database Schema for Food Store
-- Tạo database
CREATE DATABASE IF NOT EXISTS food_store;
USE food_store;

-- ==================== Table: Users ====================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(20),
    address TEXT,
    role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- ==================== Table: Categories ====================
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- ==================== Table: Products ====================
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_percent INT DEFAULT 0,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    quantity_in_stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_name (name)
);

-- ==================== Table: Orders ====================
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT,
    phone_number VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- ==================== Table: Order Items ====================
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- ==================== Table: Reviews ====================
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_product (product_id),
    INDEX idx_user (user_id),
    UNIQUE KEY unique_review (product_id, user_id)
);

-- ==================== Table: Favorites ====================
CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_user (user_id),
    UNIQUE KEY unique_favorite (user_id, product_id)
);

-- ==================== Insert Sample Data ====================

-- Insert Categories
INSERT INTO categories (name, description, image_url) VALUES
('Cơm & Cơm Tấm', 'Các món cơm ngon hàng ngày', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'),
('Phở & Mì', 'Phở bò, phở gà, mì và các canh khác', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300'),
('Snack & Chiên', 'Bánh mì, gà rán, đồ chiên', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300'),
('Thức Uống', 'Cà phê, nước ép, sinh tố', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300');

-- Insert Products
INSERT INTO products (category_id, name, description, price, discount_percent, image_url, quantity_in_stock) VALUES
(1, 'Cơm Tấm Sườn', 'Cơm tấm nóng kèm sườn nướng và trứng ốp', 35000, 15, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', 50),
(1, 'Cơm Gà Xối Mỡ', 'Cơm gà thơm ngon kèm nước sốt cà chua', 30000, 0, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', 45),
(2, 'Phở Bò', 'Phở bò truyền thống với nước dùng thơm lừng', 40000, 0, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500', 40),
(2, 'Mì Ý Sốt Cà Chua', 'Mì Ý tươi với sốt cà chua tự chế', 45000, 0, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500', 35),
(3, 'Bánh Mì Thịt', 'Bánh mì giòn kèm thịt nướng và pâté', 25000, 0, 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500', 60),
(3, 'Gà Rán Giòn', 'Gà rán giòn vàng nóng hổi', 55000, 0, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500', 30),
(4, 'Nước Cam Tươi', 'Nước cam tươi mát vắt từ cam Việt Nam', 15000, 0, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500', 100),
(4, 'Cà Phê Đen Đá', 'Cà phê đen đá cổ điển ngon lẫm', 20000, 0, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500', 80);

-- ==================== Create Views ====================

-- View: Product with category info
CREATE OR REPLACE VIEW product_details AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.discount_percent,
    (p.price * (100 - p.discount_percent) / 100) as discounted_price,
    p.image_url,
    p.quantity_in_stock,
    c.id as category_id,
    c.name as category_name,
    p.created_at,
    p.updated_at
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE;

-- View: Order summary
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.user_id,
    u.username,
    u.email,
    o.total_price,
    o.status,
    COUNT(oi.id) as item_count,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.user_id, u.username, u.email, o.total_price, o.status, o.created_at;

-- View: User total purchases
CREATE OR REPLACE VIEW user_purchases AS
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(o.id) as total_orders,
    SUM(o.total_price) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username, u.email;
