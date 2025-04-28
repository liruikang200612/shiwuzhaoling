const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Building = require('./models/Building');
const LostItem = require('./models/LostItem');

// 加载环境变量
dotenv.config();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scu_lost_found', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 管理员数据
const adminData = {
  username: 'admin',
  email: 'admin@scu.edu.cn',
  password: 'admin123',
  role: 'admin',
  isActive: true,
  lastLogin: new Date()
};

// 建筑物数据
const buildingsData = [
  {
    buildingId: '1',
    name: '一教A座',
    classrooms: [
      { roomId: '101', name: '一教A座101', capacity: 100 },
      { roomId: '102', name: '一教A座102', capacity: 80 },
      { roomId: '201', name: '一教A座201', capacity: 100 },
      { roomId: '202', name: '一教A座202', capacity: 80 },
      { roomId: '301', name: '一教A座301', capacity: 100 }
    ]
  },
  {
    buildingId: '2',
    name: '一教B座',
    classrooms: [
      { roomId: '101', name: '一教B座101', capacity: 90 },
      { roomId: '102', name: '一教B座102', capacity: 70 },
      { roomId: '201', name: '一教B座201', capacity: 90 },
      { roomId: '202', name: '一教B座202', capacity: 70 },
      { roomId: '301', name: '一教B座301', capacity: 90 }
    ]
  },
  {
    buildingId: '3',
    name: '一教C座',
    classrooms: [
      { roomId: '101', name: '一教C座101', capacity: 110 },
      { roomId: '102', name: '一教C座102', capacity: 85 },
      { roomId: '201', name: '一教C座201', capacity: 110 },
      { roomId: '202', name: '一教C座202', capacity: 85 },
      { roomId: '301', name: '一教C座301', capacity: 110 }
    ]
  },
  {
    buildingId: '4',
    name: '一教D座',
    classrooms: [
      { roomId: '101', name: '一教D座101', capacity: 95 },
      { roomId: '102', name: '一教D座102', capacity: 75 },
      { roomId: '201', name: '一教D座201', capacity: 95 },
      { roomId: '202', name: '一教D座202', capacity: 75 },
      { roomId: '301', name: '一教D座301', capacity: 95 }
    ]
  },
  {
    buildingId: '5',
    name: '综合楼',
    classrooms: [
      { roomId: '101', name: '综合楼101', capacity: 120 },
      { roomId: '102', name: '综合楼102', capacity: 100 },
      { roomId: '201', name: '综合楼201', capacity: 120 },
      { roomId: '202', name: '综合楼202', capacity: 100 },
      { roomId: '301', name: '综合楼301', capacity: 120 }
    ]
  }
];

// 导入数据
const importData = async () => {
  try {
    // 清空现有数据
    await User.deleteMany();
    await Building.deleteMany();
    await LostItem.deleteMany();
    
    console.log('数据已清空');
    
    // 创建管理员用户
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);
    const admin = await User.create({
      ...adminData,
      password: hashedPassword
    });
    
    console.log('管理员用户已创建');
    
    // 创建建筑物
    await Building.insertMany(buildingsData);
    
    console.log('建筑物数据已导入');
    
    // 创建测试失物记录
    const lostItems = [
      {
        name: '黑色笔记本电脑',
        description: '联想ThinkPad X1，黑色，带有四川大学logo贴纸',
        building: '1',
        classroom: '101',
        date: new Date('2023-10-15'),
        status: '未认领',
        contact: '李老师，电话：028-12345678',
        image: 'https://via.placeholder.com/300x200?text=笔记本电脑',
        createdBy: admin._id
      },
      {
        name: '蓝色水杯',
        description: '不锈钢保温杯，蓝色，带有熊猫图案',
        building: '1',
        classroom: '201',
        date: new Date('2023-10-16'),
        status: '未认领',
        contact: '王老师，电话：028-87654321',
        image: 'https://via.placeholder.com/300x200?text=蓝色水杯',
        createdBy: admin._id
      },
      {
        name: '钱包',
        description: '棕色皮质钱包，内有学生证',
        building: '2',
        classroom: '101',
        date: new Date('2023-10-14'),
        status: '已认领',
        contact: '张老师，电话：028-13579246',
        image: 'https://via.placeholder.com/300x200?text=钱包',
        createdBy: admin._id,
        claimedAt: new Date('2023-10-16'),
        claimedBy: '张三'
      }
    ];
    
    await LostItem.insertMany(lostItems);
    
    console.log('测试失物数据已导入');
    
    console.log('数据导入完成!');
    process.exit();
  } catch (error) {
    console.error(`错误: ${error.message}`);
    process.exit(1);
  }
};

// 删除数据
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Building.deleteMany();
    await LostItem.deleteMany();
    
    console.log('数据已删除!');
    process.exit();
  } catch (error) {
    console.error(`错误: ${error.message}`);
    process.exit(1);
  }
};

// 根据命令行参数执行操作
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
} 