import { Router } from 'express';
import categoryController from '#controllers/categoryController.js';
import authMiddleware from '#middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, (req, res, next) => categoryController.create(req, res, next));
router.get('/', authMiddleware, (req, res, next) => categoryController.list(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => categoryController.get(req, res, next));
router.put('/:id', authMiddleware, (req, res, next) => categoryController.update(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => categoryController.remove(req, res, next));

export default router;
