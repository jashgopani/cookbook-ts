import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Category } from '../models/Category';

export const categoryController = {
  // GET /categories
  index: async (_req: Request, res: Response) => {
    try {
      const categoryRepository = getConnection().getRepository(Category);
      const categories = await categoryRepository.find({
        relations: ['recipes']
      });
      res.render('categories/index', { categories, messages: {} });
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to fetch categories' });
    }
  },

  // GET /categories/:id
  show: async (req: Request, res: Response) => {
    try {
      const categoryRepository = getConnection().getRepository(Category);
      const category = await categoryRepository.findOne(parseInt(req.params.id), {
        relations: ['recipes']
      });
      
      if (!category) {
        return res.status(404).render('error', { error: 'Category not found' });
      }
      
      res.render('categories/show', { category });
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to fetch category' });
    }
  },

  // GET /categories/new
  new: async (_req: Request, res: Response) => {
    res.render('categories/new', { 
      category: {},
      errors: {},
      messages: {}
    });
  },

  // POST /categories
  create: async (req: Request, res: Response) => {
    try {
      const categoryRepository = getConnection().getRepository(Category);
      const category = categoryRepository.create({
        name: req.body.name
      });
      
      await categoryRepository.save(category);
      res.redirect('/categories');
    } catch (error) {
      res.render('categories/new', {
        category: req.body,
        errors: { name: 'Failed to create category' },
        messages: {}
      });
    }
  },

  // GET /categories/:id/edit
  edit: async (req: Request, res: Response) => {
    try {
      const categoryRepository = getConnection().getRepository(Category);
      const category = await categoryRepository.findOne(parseInt(req.params.id));
      
      if (!category) {
        return res.status(404).render('error', { error: 'Category not found' });
      }
      
      res.render('categories/edit', { 
        category,
        errors: {},
        messages: {}
      });
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to fetch category' });
    }
  },

  // PUT /categories/:id
  update: async (req: Request, res: Response) => {
    try {
      const categoryRepository = getConnection().getRepository(Category);
      const category = await categoryRepository.findOne(parseInt(req.params.id));
      
      if (!category) {
        return res.status(404).render('error', { error: 'Category not found' });
      }

      categoryRepository.merge(category, { name: req.body.name });
      await categoryRepository.save(category);
      
      res.redirect(`/categories/${category.id}`);
    } catch (error) {
      res.render('categories/edit', {
        category: { ...req.body, id: req.params.id },
        errors: { name: 'Failed to update category' },
        messages: {}
      });
    }
  },

  // DELETE /categories/:id
  destroy: async (req: Request, res: Response) => {
    try {
      const categoryRepository = getConnection().getRepository(Category);
      const category = await categoryRepository.findOne(parseInt(req.params.id), {
        relations: ['recipes']
      });
      
      if (!category) {
        return res.status(404).render('error', { error: 'Category not found' });
      }

      if (category.recipes && category.recipes.length > 0) {
        return res.status(400).render('categories/show', {
          category,
          messages: { error: 'Cannot delete category with recipes' }
        });
      }

      await categoryRepository.remove(category);
      res.redirect('/categories');
    } catch (error) {
      res.status(500).render('error', { error: 'Failed to delete category' });
    }
  }
};
