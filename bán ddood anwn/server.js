// ==================== API Backend - Food Store ====================
// File: server.js
// Requires: npm install express cors dotenv bcryptjs jsonwebtoken mysql2 body-parser

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_this';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== Database Connection Pool ====================
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_store',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==================== Middleware: Verify JWT ====================
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token không được tìm thấy' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token không hợp lệ' 
        });
    }
};

// ==================== API: User Registration ====================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, full_name, phone } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        const connection = await pool.getConnection();

        // Check if user already exists
        const [users] = await connection.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (users.length > 0) {
            connection.release();
            return res.status(400).json({
                success: false,
                message: 'Username hoặc email đã tồn tại'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await connection.query(
            'INSERT INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, full_name || null, phone || null]
        );

        connection.release();

        res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công',
            user_id: result.insertId
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
});

// ==================== API: User Login ====================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập username và password'
            });
        }

        const connection = await pool.getConnection();

        // Find user
        const [users] = await connection.query(
            'SELECT id, username, email, password, full_name, role FROM users WHERE username = ? AND is_active = TRUE',
            [username]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
            });
        }

        const user = users[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            connection.release();
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
            });
        }

        connection.release();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
});

// ==================== API: Get User Profile ====================
app.get('/api/auth/profile', verifyToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [users] = await connection.query(
            'SELECT id, username, email, full_name, phone, address, role, avatar_url, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        connection.release();

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tìm thấy'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
});

// ==================== API: Update User Profile ====================
app.put('/api/auth/profile', verifyToken, async (req, res) => {
    try {
        const { full_name, phone, address, avatar_url } = req.body;
        const connection = await pool.getConnection();

        await connection.query(
            'UPDATE users SET full_name = ?, phone = ?, address = ?, avatar_url = ? WHERE id = ?',
            [full_name || null, phone || null, address || null, avatar_url || null, req.user.id]
        );

        connection.release();

        res.json({
            success: true,
            message: 'Cập nhật thông tin thành công'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
});

// ==================== API: Change Password ====================
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        const connection = await pool.getConnection();

        // Get current password
        const [users] = await connection.query(
            'SELECT password FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tìm thấy'
            });
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(old_password, users[0].password);
        if (!isPasswordValid) {
            connection.release();
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu cũ không chính xác'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update password
        await connection.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        connection.release();

        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
});

// ==================== API: Get All Products ====================
app.get('/api/products', async (req, res) => {
    try {
        const { category_id, search, limit = 10, offset = 0 } = req.query;
        const connection = await pool.getConnection();

        let query = 'SELECT * FROM product_details WHERE 1=1';
        const params = [];

        if (category_id) {
            query += ' AND category_id = ?';
            params.push(category_id);
        }

        if (search) {
            query += ' AND name LIKE ?';
            params.push(`%${search}%`);
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [products] = await connection.query(query, params);
        connection.release();

        res.json({
            success: true,
            products: products,
            count: products.length
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
});

// ==================== API: Create Order ====================
app.post('/api/orders', verifyToken, async (req, res) => {
    try {
        const { items, delivery_address, phone_number, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Giỏ hàng trống'
            });
        }

        const connection = await pool.getConnection();

        // Calculate total price
        let total_price = 0;
        for (const item of items) {
            const [products] = await connection.query(
                'SELECT price, discount_percent FROM products WHERE id = ?',
                [item.product_id]
            );
            
            if (products.length > 0) {
                const discounted_price = products[0].price * (100 - products[0].discount_percent) / 100;
                total_price += discounted_price * item.quantity;
            }
        }

        // Insert order
        const [result] = await connection.query(
            'INSERT INTO orders (user_id, total_price, delivery_address, phone_number, notes) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, total_price, delivery_address, phone_number, notes]
        );

        const order_id = result.insertId;

        // Insert order items
        for (const item of items) {
            const [products] = await connection.query(
                'SELECT price, discount_percent FROM products WHERE id = ?',
                [item.product_id]
            );

            if (products.length > 0) {
                const price = products[0].price;
                const discounted_price = price * (100 - products[0].discount_percent) / 100;
                const subtotal = discounted_price * item.quantity;

                await connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
                    [order_id, item.product_id, item.quantity, discounted_price, subtotal]
                );
            }
        }

        connection.release();

        res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công',
            order_id: order_id,
            total_price: total_price
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
});

// ==================== API: Get User Orders ====================
app.get('/api/orders', verifyToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [orders] = await connection.query(
            'SELECT * FROM order_summary WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        connection.release();

        res.json({
            success: true,
            orders: orders
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
});

// ==================== Error Handling ====================
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Lỗi máy chủ',
        error: err.message
    });
});

// ==================== Start Server ====================
app.listen(PORT, () => {
    console.log(`✓ Food Store API running on http://localhost:${PORT}`);
    console.log('Endpoints available:');
    console.log('  POST   /api/auth/register - Đăng ký');
    console.log('  POST   /api/auth/login - Đăng nhập');
    console.log('  GET    /api/auth/profile - Lấy thông tin người dùng');
    console.log('  PUT    /api/auth/profile - Cập nhật thông tin');
    console.log('  POST   /api/auth/change-password - Đổi mật khẩu');
    console.log('  GET    /api/products - Danh sách sản phẩm');
    console.log('  POST   /api/orders - Tạo đơn hàng');
    console.log('  GET    /api/orders - Danh sách đơn hàng');
});

module.exports = app;
