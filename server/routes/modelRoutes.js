const express = require('express');
const router = express.Router();
const VehicleModel = require('../models/VehicleModel');
const { protect, restrictTo } = require('../middleware/auth');

// Get all models
router.get('/', protect, async (req, res) => {
  try {
    const models = await VehicleModel.find();
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new model (Superadmin only)
router.post('/', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const model = await VehicleModel.create(req.body);
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete model (Superadmin only)
router.delete('/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    await VehicleModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Model deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update stock (for manager & admin)
router.patch('/:id/stock', protect, async (req, res) => {
  try {
    const model = await VehicleModel.findByIdAndUpdate(
      req.params.id, 
      { $set: { stock: req.body.stock } },
      { new: true }
    );

    // Emit live update
    const io = req.app.get('io');
    io.emit('stock_updated', model);

    res.json(model);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
