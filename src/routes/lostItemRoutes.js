const express = require('express');
const {
  getAllLostItems,
  getLostItem,
  createLostItem,
  updateLostItem,
  deleteLostItem,
  claimLostItem
} = require('../controllers/lostItemController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// 公共路由
router.get('/', getAllLostItems);
router.get('/:id', getLostItem);

// 认证路由
router.post('/', protect, createLostItem);
router.put('/:id', protect, updateLostItem);
router.delete('/:id', protect, deleteLostItem);
router.put('/:id/claim', protect, claimLostItem);

module.exports = router; 