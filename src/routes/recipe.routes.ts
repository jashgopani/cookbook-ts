import express from 'express';
import { recipeController } from '../controllers/recipe.controller';

const router = express.Router();

// Recipe routes
router.get('/', recipeController.index);
router.get('/new', recipeController.new);
router.post('/', recipeController.create);
router.get('/:id', recipeController.show);
router.get('/:id/edit', recipeController.edit);
router.put('/:id', recipeController.update);
router.delete('/:id', recipeController.destroy);

export const recipeRoutes = router;
