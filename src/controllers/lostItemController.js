const LostItem = require('../models/LostItem');
const Building = require('../models/Building');

// @desc   获取所有失物
// @route  GET /api/lost-items
// @access Public
exports.getAllLostItems = async (req, res) => {
  try {
    // 查询参数
    const { building, classroom, status } = req.query;
    let query = {};
    
    // 筛选条件
    if (building) {
      query.building = building;
    }
    
    if (classroom) {
      query.classroom = classroom;
    }
    
    if (status) {
      query.status = status;
    }
    
    // 查询数据
    const lostItems = await LostItem.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: lostItems.length,
      data: lostItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   获取单个失物
// @route  GET /api/lost-items/:id
// @access Public
exports.getLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    
    if (!lostItem) {
      return res.status(404).json({ message: '未找到该失物' });
    }
    
    res.status(200).json({
      success: true,
      data: lostItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   创建失物记录
// @route  POST /api/lost-items
// @access Private
exports.createLostItem = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      building, 
      classroom, 
      date, 
      contact, 
      image 
    } = req.body;
    
    // 验证建筑和教室是否存在
    const existingBuilding = await Building.findOne({ buildingId: building });
    if (!existingBuilding) {
      return res.status(400).json({ message: '无效的建筑ID' });
    }
    
    const hasClassroom = existingBuilding.classrooms.some(room => 
      room.roomId === classroom || room === classroom
    );
    
    if (!hasClassroom) {
      return res.status(400).json({ message: '无效的教室ID' });
    }
    
    // 创建失物记录
    const lostItem = await LostItem.create({
      name,
      description,
      building,
      classroom,
      date: date || Date.now(),
      contact,
      image,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: lostItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   更新失物记录
// @route  PUT /api/lost-items/:id
// @access Private
exports.updateLostItem = async (req, res) => {
  try {
    let lostItem = await LostItem.findById(req.params.id);
    
    if (!lostItem) {
      return res.status(404).json({ message: '未找到该失物' });
    }
    
    // 检查是否是创建者或管理员
    if (lostItem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权更新该失物记录' });
    }
    
    // 更新字段
    lostItem = await LostItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: lostItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   删除失物记录
// @route  DELETE /api/lost-items/:id
// @access Private
exports.deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    
    if (!lostItem) {
      return res.status(404).json({ message: '未找到该失物' });
    }
    
    // 检查是否是创建者或管理员
    if (lostItem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权删除该失物记录' });
    }
    
    await lostItem.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   标记物品为已认领
// @route  PUT /api/lost-items/:id/claim
// @access Private
exports.claimLostItem = async (req, res) => {
  try {
    const { claimedBy } = req.body;
    
    let lostItem = await LostItem.findById(req.params.id);
    
    if (!lostItem) {
      return res.status(404).json({ message: '未找到该失物' });
    }
    
    // 只有创建者和管理员可以标记认领
    if (lostItem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: '无权标记该失物为已认领' });
    }
    
    // 更新状态
    lostItem = await LostItem.findByIdAndUpdate(
      req.params.id,
      {
        status: '已认领',
        claimedAt: Date.now(),
        claimedBy: claimedBy || '未记录'
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: lostItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 