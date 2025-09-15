'use strict';

const categoriesRepo = require('../repositories/categoriesRepository');
const { requireString, optionalString, collect } = require('../utils/validators');

// PUBLIC_INTERFACE
async function listCategories() {
  /** List categories. */
  return categoriesRepo.listCategories();
}

// PUBLIC_INTERFACE
async function getCategory(id) {
  /** Get category by id. */
  return categoriesRepo.getCategoryById(id);
}

// PUBLIC_INTERFACE
async function createCategory(payload) {
  /** Validate and create category. */
  const v = collect(
    requireString(payload.name, 'name', { min: 1, max: 100 }),
    optionalString(payload.color, 'color', { max: 20 })
  );
  if (!v.valid) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = v.errors;
    throw err;
  }
  return categoriesRepo.createCategory(payload);
}

// PUBLIC_INTERFACE
async function updateCategory(id, payload) {
  /** Validate and update category. */
  const v = collect(
    payload.name !== undefined ? requireString(payload.name, 'name', { min: 1, max: 100 }) : { valid: true, errors: [] },
    optionalString(payload.color, 'color', { max: 20 })
  );
  if (!v.valid) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = v.errors;
    throw err;
  }
  return categoriesRepo.updateCategory(id, payload);
}

// PUBLIC_INTERFACE
async function deleteCategory(id) {
  /** Delete category by id. */
  return categoriesRepo.deleteCategory(id);
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
