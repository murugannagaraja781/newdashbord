const express = require('express');
const router = express.Router();
const PFIOrder = require('../models/PFIOrder');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const orders = await PFIOrder.find().populate('supplier').populate('items.model');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const order = await PFIOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const order = await PFIOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    await PFIOrder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
