import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Category } from '../models/Category';
import { Recipe } from '../models/Recipe';

export const recipeController = {
  // GET /recipes
  index: async (req: Request, res: Response) => {
    try {
      const recipeRepository = getConnection().getRepository(Recipe);
      const recipes = await recipeRepository.find({
        relations: ['category']
      });
      
      // Get any flash messages stored in app.locals
      const messages = req.app.locals.messages || {};
      // Clear the messages after retrieving them
      req.app.locals.messages = {};
      
      res.render('recipes/index', { recipes, messages });
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to fetch recipes', messages: {} });
    }
  },

  // GET /recipes/:id
  show: async (req: Request, res: Response) => {
    try {
      const recipeRepository = getConnection().getRepository(Recipe);
      const recipe = await recipeRepository.findOne(parseInt(req.params.id), {
        relations: ['category']
      });
      
      if (!recipe) {
        return res.status(404).render('error', { error: 'Recipe not found', messages: {} });
      }
      
      res.render('recipes/show', { recipe, messages: {} });
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to fetch recipe', messages: {} });
    }
  },

  // GET /recipes/new
  new: async (_req: Request, res: Response) => {
    try {
      const categoryRepository = getConnection().getRepository(Category);
      const categories = await categoryRepository.find();
      res.render('recipes/new', { 
        recipe: {},
        categories,
        errors: {},
        messages: {}
      });
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to load form', messages: {} });
    }
  },

  // POST /recipes
  create: async (req: Request, res: Response) => {
    try {
      const recipeRepository = getConnection().getRepository(Recipe);
      const recipe = recipeRepository.create({
        title: req.body.title,
        description: req.body.description,
        instructions: req.body.instructions,
        category: { id: parseInt(req.body.categoryId) }
      });
      
      await recipeRepository.save(recipe);
      
      // Set success message
      req.app.locals.messages = { success: 'Recipe created successfully' };
      res.redirect('/recipes');
    } catch (error) {
      const categoryRepository = getConnection().getRepository(Category);
      const categories = await categoryRepository.find();
      res.render('recipes/new', {
        recipe: req.body,
        categories,
        errors: { general: 'Failed to create recipe' },
        messages: {}
      });
    }
  },

  // GET /recipes/:id/edit
  edit: async (req: Request, res: Response) => {
    try {
      const recipeRepository = getConnection().getRepository(Recipe);
      const categoryRepository = getConnection().getRepository(Category);
      
      const recipe = await recipeRepository.findOne(parseInt(req.params.id), {
        relations: ['category']
      });
      
      const categories = await categoryRepository.find();
      
      if (!recipe) {
        return res.status(404).render('error', { error: 'Recipe not found', messages: {} });
      }
      
      res.render('recipes/edit', { 
        recipe,
        categories,
        errors: {},
        messages: {}
      });
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to fetch recipe', messages: {} });
    }
  },

  // PUT /recipes/:id
  update: async (req: Request, res: Response) => {
    try {
      const recipeRepository = getConnection().getRepository(Recipe);
      const recipe = await recipeRepository.findOne(parseInt(req.params.id));
      
      if (!recipe) {
        return res.status(404).render('error', { error: 'Recipe not found', messages: {} });
      }

      recipeRepository.merge(recipe, {
        title: req.body.title,
        description: req.body.description,
        instructions: req.body.instructions,
        category: { id: parseInt(req.body.categoryId) }
      });
      
      await recipeRepository.save(recipe);
      
      // Set success message
      req.app.locals.messages = { success: 'Recipe updated successfully' };
      res.redirect(`/recipes/${recipe.id}`);
    } catch (error) {
      const categoryRepository = getConnection().getRepository(Category);
      const categories = await categoryRepository.find();
      res.render('recipes/edit', {
        recipe: { ...req.body, id: req.params.id },
        categories,
        errors: { general: 'Failed to update recipe' },
        messages: {}
      });
    }
  },

  // DELETE /recipes/:id
  destroy: async (req: Request, res: Response) => {
    try {
      const recipeRepository = getConnection().getRepository(Recipe);
      const recipe = await recipeRepository.findOne(parseInt(req.params.id));
      
      if (!recipe) {
        return res.status(404).render('error', { error: 'Recipe not found', messages: {} });
      }

      await recipeRepository.remove(recipe);
      
      // Set success message for redirect
      req.app.locals.messages = { success: 'Recipe deleted successfully' };
      res.redirect('/recipes');
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to delete recipe', messages: {} });
    }
  }
};
