const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由，要求用户登录
exports.protect = async (req, res, next) => {
  let token;

  // 从请求头获取token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 检查是否有token
  if (!token) {
    return res.status(401).json({ message: '未授权访问，请登录' });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'scu_lost_found_secret_key');

    // 获取用户信息
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: '找不到用户' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: '未授权访问，请重新登录' });
  }
};

// 授权中间件（仅管理员可访问）
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '仅管理员可访问此资源' });
  }
}; 