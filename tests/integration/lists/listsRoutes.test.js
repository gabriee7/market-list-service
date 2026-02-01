import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const mockService = {
  createList: jest.fn(),
  addItem: jest.fn(),
  getListsByUserId: jest.fn(),
  updateList: jest.fn(),
  deleteList: jest.fn()
};

jest.unstable_mockModule('#services/listService.js', () => ({ default: mockService }));
jest.unstable_mockModule('#middlewares/authMiddleware.js', () => ({ default: (req, res, next) => { req.user = { id: 'u1' }; next(); } }));

let listRoutes;
beforeAll(async () => {
  const mod = await import('#routes/listRoutes.js');
  listRoutes = mod.default;
});

describe('Lists routes (integration)', () => {
  let app;
  beforeEach(() => {
    mockService.createList.mockReset();
    mockService.addItem.mockReset();
    mockService.getListsByUserId.mockReset();
    mockService.updateList.mockReset();
    mockService.deleteList.mockReset();
    app = express();
    app.use(express.json());
    app.use('/api/lists', listRoutes);
  });

  it('POST /api/lists creates a list', async () => {
    // Arrange
    mockService.createList.mockResolvedValue({ id: 'l1', user_id: 'u1', name: 'L' });
    // Action
    const res = await request(app).post('/api/lists').send({ name: 'L' });
    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'l1');
  });

  it('GET /api/lists returns lists', async () => {
    // Arrange
    mockService.getListsByUserId.mockResolvedValue([{ id: 'l1', name: 'L', items: [], total: 0 }]);
    // Action
    const res = await request(app).get('/api/lists');
    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/lists/:id/items adds item', async () => {
    // Arrange
    mockService.addItem.mockResolvedValue({ id: 'it1', subtotal: 20 });
    // Action
    const res = await request(app).post('/api/lists/l1/items').send({ productName: 'P', quantity: 2, unitPrice: 10 });
    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('subtotal', 20);
  });

  it('PUT /api/lists/:id updates list', async () => {
    // Arrange
    mockService.updateList.mockResolvedValue({ id: 'l1', name: 'Novo' });
    // Action
    const res = await request(app).put('/api/lists/l1').send({ name: 'Novo' });
    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Novo');
  });

  it('DELETE /api/lists/:id deletes list', async () => {
    // Arrange
    mockService.deleteList.mockResolvedValue(true);
    // Action
    const res = await request(app).delete('/api/lists/l1');
    // Assert
    expect(res.status).toBe(204);
  });
});