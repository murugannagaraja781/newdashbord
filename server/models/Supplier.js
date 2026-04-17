const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  division: {
    type: String,
    enum: ['LCV', 'Passenger', 'Heavy', 'Special'],
    required: true,
  },
  contactPerson: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    default: 'China',
  },
  origin: {
    type: String,
    default: 'China',
  },
  paymentMode: {
    type: String,
    enum: ['T/T', 'LC', 'CAD'],
    default: 'T/T',
  },
  leadTime: {
    type: Number, // In days
    default: 60,
  },
  commitmentTarget: {
    type: Number, // Units per year
    default: 0,
  },
  unitsCommitted: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
