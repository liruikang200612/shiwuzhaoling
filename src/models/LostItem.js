const mongoose = require('mongoose');

// 定义失物招领物品模式
const lostItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  building: {
    type: String,
    required: true,
    ref: 'Building'
  },
  classroom: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['未认领', '已认领'],
    default: '未认领'
  },
  contact: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=失物招领'
  },
  claimedAt: {
    type: Date
  },
  claimedBy: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const LostItem = mongoose.model('LostItem', lostItemSchema);

module.exports = LostItem; 