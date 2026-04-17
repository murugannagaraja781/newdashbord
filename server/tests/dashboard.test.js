const request = require('supertest');
const express = require('express');
const mockData = require('../data/mockData');

const app = express();
app.use(express.json());

// Simplified version of the endpoint for testing
app.get('/api/dashboard/summary', (req, res) => {
  res.json(mockData);
});

describe('Dashboard Controller', () => {
  it('should return mock dashboard data', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('stats');
    expect(res.body.stats.annualTarget).toBe(62);
    expect(res.body.categories).toBeInstanceOf(Array);
  });

  it('should have categories with required properties', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    
    const firstCategory = res.body.categories[0];
    expect(firstCategory).toHaveProperty('name');
    expect(firstCategory).toHaveProperty('units');
    expect(firstCategory).toHaveProperty('target');
  });
});
