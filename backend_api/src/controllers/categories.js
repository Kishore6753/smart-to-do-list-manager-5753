'use strict';

const service = require('../services/categories');

class CategoriesController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** List categories. */
    try {
      const data = await service.listCategories();
      res.json(data);
    } catch (err) { next(err); }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Get category by id. */
    try {
      const data = await service.getCategory(Number(req.params.id));
      if (!data) return res.status(404).json({ message: 'Category not found' });
      res.json(data);
    } catch (err) { next(err); }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Create category. */
    try {
      const data = await service.createCategory(req.body || {});
      res.status(201).json(data);
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ message: err.message, errors: err.details || [] });
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Update category by id. */
    try {
      const data = await service.updateCategory(Number(req.params.id), req.body || {});
      if (!data) return res.status(404).json({ message: 'Category not found' });
      res.json(data);
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ message: err.message, errors: err.details || [] });
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Delete category by id. */
    try {
      const ok = await service.deleteCategory(Number(req.params.id));
      if (!ok) return res.status(404).json({ message: 'Category not found' });
      res.status(204).send();
    } catch (err) { next(err); }
  }
}

module.exports = new CategoriesController();
