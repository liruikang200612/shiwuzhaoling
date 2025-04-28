const mongoose = require('mongoose');

// 教室模式
const ClassroomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: [true, '请提供教室ID'],
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, '请提供教室名称'],
    trim: true
  },
  capacity: {
    type: Number,
    default: 0
  },
  facilities: {
    type: [String],
    default: []
  }
});

// 建筑物模式
const BuildingSchema = new mongoose.Schema(
  {
    buildingId: {
      type: String,
      required: [true, '请提供建筑ID'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, '请提供建筑名称'],
      trim: true
    },
    classrooms: {
      type: [ClassroomSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Building', BuildingSchema); 