const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Setup app for testing
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.json({ message: 'API padrão Node.js com Express!' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

describe('Rotas básicas', () => {
  it('GET / deve retornar mensagem padrão', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /health deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
