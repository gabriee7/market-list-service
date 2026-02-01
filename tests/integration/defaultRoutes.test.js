import request from 'supertest';
import express from 'express';
import routes from '#routes/index.js';

const app = express();
app.use(express.json());
app.use(routes);

describe('Default/Health Routes', () => {
  it('deve retornar mensagem padrão em GET /', async () => {
    // Arrange & Action
    const res = await request(app).get('/');
    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('deve retornar status ok em GET /health', async () => {
    // Arrange & Action
    const res = await request(app).get('/health');
    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
