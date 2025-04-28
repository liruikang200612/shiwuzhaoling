const express = require('express');
const { 
  getAllBuildings, 
  getBuilding, 
  createBuilding, 
  updateBuilding, 
  deleteBuilding 
} = require('../controllers/buildingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 获取所有建筑物
router.get('/', getAllBuildings);

// 获取单个建筑物
router.get('/:id', getBuilding);

// 添加建筑物 - 仅管理员可操作
router.post('/', protect, authorize('admin'), createBuilding);

// 更新建筑物 - 仅管理员可操作
router.put('/:id', protect, authorize('admin'), updateBuilding);

// 删除建筑物 - 仅管理员可操作
router.delete('/:id', protect, authorize('admin'), deleteBuilding);

module.exports = router; 