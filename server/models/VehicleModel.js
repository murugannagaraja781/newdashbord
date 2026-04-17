const mongoose = require('mongoose');

const vehicleModelSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Model code is required'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['LCV', 'PC', 'HT', 'SM'],
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  pipeline: {
    type: Number,
    default: 0,
  },
  threshold: {
    type: Number,
    default: 5, // Default low stock threshold
  },
  fobPrice: {
    type: Number,
    required: true,
  },
  description: String,
}, {
  timestamps: true,
});

const VehicleModel = mongoose.model('VehicleModel', vehicleModelSchema);

module.exports = VehicleModel;
