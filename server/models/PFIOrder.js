const mongoose = require('mongoose');

const pfiOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Draft', 'Confirmed', 'In Transit', 'Shipped', 'Delivered'],
    default: 'Draft',
  },
  items: [{
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleModel',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: Number,
  }],
  financials: {
    fobTotal: Number,
    freight: Number,
    cifTotal: Number,
    declaredValue: Number,
    paymentMode: String,
  },
  containers: {
    type: String, // e.g., "4 × 40HQ"
  },
}, {
  timestamps: true,
});

const PFIOrder = mongoose.model('PFIOrder', pfiOrderSchema);

module.exports = PFIOrder;
