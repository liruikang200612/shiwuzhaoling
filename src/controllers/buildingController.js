const Building = require('../models/Building');

// @desc   获取所有建筑物
// @route  GET /api/buildings
// @access Public
exports.getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    
    res.status(200).json({
      success: true,
      count: buildings.length,
      data: buildings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   获取单个建筑物
// @route  GET /api/buildings/:id
// @access Public
exports.getBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    
    if (!building) {
      return res.status(404).json({ message: '未找到建筑物' });
    }
    
    res.status(200).json({
      success: true,
      data: building
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   创建建筑物
// @route  POST /api/buildings
// @access Private/Admin
exports.createBuilding = async (req, res) => {
  try {
    const { buildingId, name, classrooms } = req.body;
    
    // 检查建筑ID是否已存在
    const existingBuilding = await Building.findOne({ buildingId });
    if (existingBuilding) {
      return res.status(400).json({ message: '建筑ID已存在' });
    }
    
    const building = await Building.create({
      buildingId,
      name,
      classrooms
    });
    
    res.status(201).json({
      success: true,
      data: building
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   更新建筑物
// @route  PUT /api/buildings/:id
// @access Private/Admin
exports.updateBuilding = async (req, res) => {
  try {
    const { buildingId, name, classrooms } = req.body;
    
    // 如果更新buildingId，需要检查是否与其他记录冲突
    if (buildingId) {
      const existingBuilding = await Building.findOne({ 
        buildingId, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingBuilding) {
        return res.status(400).json({ message: '建筑ID已存在' });
      }
    }
    
    let building = await Building.findById(req.params.id);
    
    if (!building) {
      return res.status(404).json({ message: '未找到建筑物' });
    }
    
    building = await Building.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: building
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc   删除建筑物
// @route  DELETE /api/buildings/:id
// @access Private/Admin
exports.deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    
    if (!building) {
      return res.status(404).json({ message: '未找到建筑物' });
    }
    
    await building.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 