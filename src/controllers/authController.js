const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 生成JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'scu_lost_found_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc   用户登录
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ message: '请提供用户名和密码' });
    }

    // 查找用户
    const user = await User.findOne({ username });

    // 检查用户是否存在
    if (!user) {
      return res.status(401).json({ message: '无效的用户名或密码' });
    }

    // 验证密码
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '无效的用户名或密码' });
    }

    // 更新最后登录时间
    user.lastLogin = Date.now();
    await user.save();

    // 返回token
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   注册管理员
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, adminCode } = req.body;

    // 验证管理员授权码
    if (adminCode !== (process.env.ADMIN_CODE || 'SCU-ADMIN-2023')) {
      return res.status(401).json({ message: '无效的管理员授权码' });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已被注册' });
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
      role: 'admin',
      lastLogin: Date.now()
    });

    // 返回token
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   获取当前用户信息
// @route  GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 