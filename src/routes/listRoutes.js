import express from 'express';
import listController from '#controllers/listController.js';
import authMiddleware from '#middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, listController.createList);
router.post('/:id/items', authMiddleware, listController.addItem);
router.put('/:id/items/:itemId', authMiddleware, listController.updateItem);
router.delete('/:id/items/:itemId', authMiddleware, listController.deleteItem);
router.get('/', authMiddleware, listController.getLists);
router.get('/:id', authMiddleware, listController.getList);
router.get('/:id/items', authMiddleware, listController.getItems);
router.put('/:id', authMiddleware, listController.updateList);
router.delete('/:id', authMiddleware, listController.deleteList);

export default router;