import express from 'express';
import defaultRoutes from './defaultRoutes.js';

const router = express.Router();

router.use('/', defaultRoutes);

export default router;
