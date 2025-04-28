const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// 路由文件
const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const lostItemRoutes = require('./routes/lostItemRoutes');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// 挂载路由
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/items', lostItemRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: '四川大学江安校区教室失物招领系统API' });
});

// 端口设置
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err, promise) => {
  console.log(`错误: ${err.message}`);
  // 关闭服务器并退出进程
  server.close(() => process.exit(1));
}); 