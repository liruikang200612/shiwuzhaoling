const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema(
  {
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
    buildingId: {
      type: String,
      required: [true, '请提供所属建筑ID'],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Classroom', ClassroomSchema); 