import express from 'express';
import { categoryRoutes } from './category.routes';
import { recipeRoutes } from './recipe.routes';

const router = express.Router();

// Home page route
router.get('/', (req, res) => {
    res.render('home', { messages: {} });
});

router.use('/categories', categoryRoutes);
router.use('/recipes', recipeRoutes);

export default router;
