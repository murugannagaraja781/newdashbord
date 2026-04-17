const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { protect, restrictTo } = require('../middleware/auth');
const User = require('../models/User');

// Mocking User model and JWT
jest.mock('../models/User');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

app.get('/test-protect', protect, (req, res) => {
  res.status(200).json({ message: 'Success', user: req.user });
});

app.get('/test-admin', protect, restrictTo('superadmin'), (req, res) => {
  res.status(200).json({ message: 'Admin Success' });
});

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fail if no token provided', async () => {
    const res = await request(app).get('/test-protect');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Not authorized, no token');
  });

  it('should pass if valid token provided', async () => {
    const mockUser = { _id: '123', name: 'Test User', role: 'manager' };
    jwt.verify.mockReturnValue({ id: '123' });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    const res = await request(app)
      .get('/test-protect')
      .set('Authorization', 'Bearer valid-token');

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toEqual(mockUser);
  });

  it('should restrict access based on role', async () => {
    const mockUser = { _id: '123', name: 'Test User', role: 'manager' };
    jwt.verify.mockReturnValue({ id: '123' });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    const res = await request(app)
      .get('/test-admin')
      .set('Authorization', 'Bearer valid-token');

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('You do not have permission to perform this action');
  });
});
