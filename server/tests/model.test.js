const mongoose = require('mongoose');
const VehicleModel = require('../models/VehicleModel');

describe('VehicleModel Model Test', () => {
    beforeAll(async () => {
        const url = 'mongodb://127.0.0.1/vehicle_test';
        // Mocking mongoose connect if unnecessary for unit test, 
        // but usually we use a memory server.
    });

    it('should create a vehicle model object successfully', () => {
        const vehicleData = {
            code: 'JAC-001',
            name: 'Test Truck',
            category: 'LCV',
            fobPrice: 5000
        };
        const validVehicle = new VehicleModel(vehicleData);
        
        expect(validVehicle.code).toBe(vehicleData.code);
        expect(validVehicle.name).toBe(vehicleData.name);
        expect(validVehicle.category).toBe(vehicleData.category);
        expect(validVehicle.fobPrice).toBe(vehicleData.fobPrice);
    });

    it('should fail if required fields are missing', () => {
        const vehicleWithoutCode = new VehicleModel({ name: 'Test' });
        const err = vehicleWithoutCode.validateSync();
        expect(err).toBeDefined();
    });
});
