const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const VehicleModel = require('../models/VehicleModel');
const Supplier = require('../models/Supplier');
const PFIOrder = require('../models/PFIOrder');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding original-look data...');

    // Clear existing data
    await User.deleteMany();
    await VehicleModel.deleteMany();
    await Supplier.deleteMany();
    await PFIOrder.deleteMany();

    // 1. Create Users
    const superadmin = await User.create({
      name: 'Super Admin',
      email: 'admin@jac.com',
      password: 'password123',
      role: 'superadmin'
    });

    const manager = await User.create({
      name: 'Operations Manager',
      email: 'manager@jac.com',
      password: 'password123',
      role: 'manager'
    });

    // 2. Create Suppliers (From HTML)
    const suppliers = await Supplier.insertMany([
      { name: 'JAC Motors — LCV Division', division: 'LCV', origin: 'China', paymentMode: 'T/T', leadTime: 75, commitmentTarget: 200, unitsCommitted: 136 },
      { name: 'JAC Motors — SUV / Passenger', division: 'Passenger', origin: 'China', paymentMode: 'LC', leadTime: 60, commitmentTarget: 200, unitsCommitted: 148 },
      { name: 'JAC Motors — Heavy Equipment', division: 'Heavy', origin: 'China', paymentMode: 'T/T', leadTime: 90, commitmentTarget: 100, unitsCommitted: 45 },
      { name: 'JAC Motors — Special Machinery', division: 'Special', origin: 'China', paymentMode: 'CAD', leadTime: 50, commitmentTarget: 50, unitsCommitted: 26 },
    ]);

    // 3. Create Models (Comprehensive list from original HTML)
    const modelsData = [
      // LCV Category
      { code: 'HFC 1020-B', name: '1.7T Plateau – Blue', category: 'LCV', stock: 12, pipeline: 6, fobPrice: 7800 },
      { code: 'HFC 1020-W', name: '1.7T Plateau – White', category: 'LCV', stock: 9, pipeline: 4, fobPrice: 7800 },
      { code: 'HFC 5040-B', name: '2T Fourgon – Blue', category: 'LCV', stock: 4, pipeline: 8, fobPrice: 8400, threshold: 5 },
      { code: 'HFC 5040-W', name: '2T Fourgon – White', category: 'LCV', stock: 7, pipeline: 4, fobPrice: 8400 },
      { code: 'HFC 1042-B', name: '3T Plateau – Blue', category: 'LCV', stock: 8, pipeline: 5, fobPrice: 9200 },
      { code: 'HFC 1042-W', name: '3T Plateau – White', category: 'LCV', stock: 3, pipeline: 6, fobPrice: 9200, threshold: 5 },
      
      // Passenger Cars (PC)
      { code: 'HFC7151', name: 'JS2 – Intelligent', category: 'PC', stock: 8, pipeline: 3, fobPrice: 14200 },
      { code: 'JS3-Flagship', name: 'JS3 – Flagship', category: 'PC', stock: 6, pipeline: 4, fobPrice: 17500 },
      { code: 'JS4-Luxury', name: 'JS4 – Luxury', category: 'PC', stock: 9, pipeline: 5, fobPrice: 19800 },
      { code: 'JS5-Intelligent', name: 'JS5 – Intelligent', category: 'PC', stock: 4, pipeline: 6, fobPrice: 24500, threshold: 5 },
      { code: 'HFC6463', name: 'JS6 Advance', category: 'PC', stock: 10, pipeline: 3, fobPrice: 26800 },
      { code: 'JS8-Flagship', name: 'JS8 – Flagship', category: 'PC', stock: 2, pipeline: 0, fobPrice: 37800, threshold: 5 },
      
      // Heavy Trucks (HT)
      { code: 'HFC3255K1R1', name: '10T Dumper Truck 6×4', category: 'HT', stock: 3, pipeline: 5, fobPrice: 42000, threshold: 5 },
      { code: 'HFC4180KR1K3', name: 'Tractor Head 4×2', category: 'HT', stock: 5, pipeline: 3, fobPrice: 38500, threshold: 6 },
      
      // Special Machinery (SM)
      { code: 'RF8', name: 'RF8 Hybrid Van', category: 'SM', stock: 5, pipeline: 2, fobPrice: 18500 },
      { code: 'CPCD30', name: '3T Forklift', category: 'SM', stock: 4, pipeline: 3, fobPrice: 11800, threshold: 5 },
      { code: 'CPCD35', name: '3.5T Forklift', category: 'SM', stock: 4, pipeline: 0, fobPrice: 13200, threshold: 5 },
    ];

    const insertedModels = await VehicleModel.insertMany(modelsData);

    // 4. Create PFI Orders (From HTML)
    await PFIOrder.create([
      {
        orderId: 'PFI-2025-0041',
        supplier: suppliers[0]._id, // LCV
        status: 'Shipped',
        issuedDate: new Date('2025-03-02'),
        items: [
          { model: insertedModels.find(m => m.code === 'HFC 1020-B')._id, quantity: 8 },
          { model: insertedModels.find(m => m.code === 'HFC 5040-B')._id, quantity: 6 },
        ],
        financials: { fobTotal: 186400, freight: 14200, cifTotal: 200600, paymentMode: 'T/T 30% adv.' },
        containers: '4 × 40HQ'
      },
      {
        orderId: 'PFI-2025-0038',
        supplier: suppliers[1]._id, // PC
        status: 'In Transit',
        issuedDate: new Date('2025-02-14'),
        items: [
          { model: insertedModels.find(m => m.code === 'JS4-Luxury')._id, quantity: 5 },
          { model: insertedModels.find(m => m.code === 'JS8-Flagship')._id, quantity: 2 },
        ],
        financials: { fobTotal: 224600, freight: 9800, cifTotal: 234400, paymentMode: 'LC at sight' },
        containers: '2 × 40HQ'
      }
    ]);

    console.log('Database seeded with ORIGINAL-LOOK data successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
