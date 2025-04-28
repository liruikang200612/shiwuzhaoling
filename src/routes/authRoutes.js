const express = require('express');
const { login, register, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 登录路由
router.post('/login', login);

// 注册路由
router.post('/register', register);

// 获取当前用户信息
router.get('/me', protect, getMe);

module.exports = router; 