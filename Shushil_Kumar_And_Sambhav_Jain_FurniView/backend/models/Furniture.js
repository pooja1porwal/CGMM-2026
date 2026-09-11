const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  modelType: {
    type: String,
    default: 'primitive', // 'primitive' or 'glb'
  },
  modelUrl: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String, // emoji or image URL
    default: '🪑',
  },
  colors: {
    type: [String],
    default: ['#FFFFFF', '#1A1A1A', '#8B4513', '#808080', '#4169E1', '#F5F5DC'],
  },
  colorNames: {
    type: [String],
    default: ['White', 'Black', 'Brown', 'Gray', 'Blue', 'Beige'],
  },
  materials: {
    type: [String],
    default: ['Wood', 'Leather', 'Fabric', 'Metal'],
  },
  configurations: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Furniture', furnitureSchema);
