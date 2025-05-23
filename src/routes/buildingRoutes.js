const express = require('express');
const { 
  getAllBuildings, 
  getBuilding, 
  createBuilding, 
  updateBuilding, 
  deleteBuilding 
} = require('../controllers/buildingController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// 获取所有建筑物
router.get('/', getAllBuildings);

// 获取单个建筑物
router.get('/:id', getBuilding);

// 添加建筑物 - 仅管理员可操作
router.post('/', protect, adminOnly, createBuilding);

// 更新建筑物 - 仅管理员可操作
router.put('/:id', protect, adminOnly, updateBuilding);

// 删除建筑物 - 仅管理员可操作
router.delete('/:id', protect, adminOnly, deleteBuilding);

module.exports = router; 