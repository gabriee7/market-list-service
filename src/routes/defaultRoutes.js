import express from 'express';

const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
  res.json({ message: 'API padrão Node.js com Express!' });
});

// Rota de health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
