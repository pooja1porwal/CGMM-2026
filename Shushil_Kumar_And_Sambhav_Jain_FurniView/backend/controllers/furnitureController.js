const Furniture = require('../models/Furniture');

// @desc    Get all furniture items
// @route   GET /api/furniture
const getAllFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find({});
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single furniture item by ID
// @route   GET /api/furniture/:id
const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: 'Furniture not found' });
    }
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllFurniture, getFurnitureById };
