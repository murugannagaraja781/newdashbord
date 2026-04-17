const express = require('express');
const router = express.Router();
const VehicleModel = require('../models/VehicleModel');
const PFIOrder = require('../models/PFIOrder');
const Supplier = require('../models/Supplier');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, async (req, res) => {
  try {
    const models = await VehicleModel.find();
    const orders = await PFIOrder.find({ status: { $ne: 'Delivered' } });
    const suppliers = await Supplier.find();

    // Key Performance Indicators
    const totalStock = models.reduce((acc, m) => acc + m.stock, 0);
    const pipeline = models.reduce((acc, m) => acc + m.pipeline, 0);
    const lowStockCount = models.filter(m => m.stock <= m.threshold).length;
    const openOrdersCount = orders.length;

    // Annual target coverage (simplified)
    const totalCommitted = suppliers.reduce((acc, s) => acc + s.commitmentTarget, 0);
    const totalFulfilled = suppliers.reduce((acc, s) => acc + s.unitsCommitted, 0);
    const targetCoverage = totalCommitted > 0 ? Math.round((totalFulfilled / totalCommitted) * 100) : 0;

    // Category summaries
    const categories = ['LCV', 'PC', 'HT', 'SM'].map(cat => {
      const catModels = models.filter(m => m.category === cat);
      const catUnits = catModels.reduce((acc, m) => acc + m.stock, 0);
      return {
        name: cat === 'LCV' ? 'Light Commercial (LCV)' : 
              cat === 'PC' ? 'Passenger Cars (PC)' : 
              cat === 'HT' ? 'Heavy Trucks (HT)' : 'Special Machinery (SM)',
        models: catModels.length,
        series: cat === 'LCV' ? 'Trucks HFC series' : cat === 'PC' ? 'JS / J7 series' : cat === 'HT' ? 'Dumper + Tractor' : 'Forklifts',
        units: catUnits,
        target: 65, // Example static target for UI
        color: cat === 'LCV' ? '#1D9E75' : cat === 'PC' ? '#7F77DD' : cat === 'HT' ? '#BA7517' : '#D85A30',
        bg: cat === 'LCV' ? '#E1F5EE' : cat === 'PC' ? '#EEEDFE' : cat === 'HT' ? '#FAEEDA' : '#FAECE7'
      };
    });

    // Suggestions (Top 3 critical)
    const suggestions = models
      .filter(m => m.stock <= m.threshold)
      .slice(0, 4)
      .map(m => ({
        model: m.code,
        desc: m.name,
        status: `${m.stock} units left, lead time 60+ days`,
        level: m.stock === 0 ? 'critical' : 'warning'
      }));

    res.json({
      stats: {
        annualTarget: targetCoverage,
        totalStock,
        pipeline,
        lowStock: lowStockCount,
        openOrders: openOrdersCount
      },
      categories,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
