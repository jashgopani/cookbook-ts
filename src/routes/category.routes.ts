import express from 'express';
import { categoryController } from '../controllers/category.controller';

const router = express.Router();

// Category routes
router.get('/', categoryController.index);
router.get('/new', categoryController.new);
router.post('/', categoryController.create);
router.get('/:id', categoryController.show);
router.get('/:id/edit', categoryController.edit);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.destroy);

export const categoryRoutes = router;
