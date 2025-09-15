'use strict';

const db = require('../db/mysql');

// PUBLIC_INTERFACE
async function listCategories() {
  /** List all categories ordered by name. */
  const { rows } = await db.query(
    'SELECT id, name, color, created_at, updated_at FROM categories ORDER BY name ASC'
  );
  return rows;
}

// PUBLIC_INTERFACE
async function getCategoryById(id) {
  /** Retrieve a single category by id. */
  const { rows } = await db.query(
    'SELECT id, name, color, created_at, updated_at FROM categories WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function createCategory(data) {
  /** Create a new category. Expects {name, color?}. */
  const { name, color = null } = data;
  const { rows: result } = await db.query(
    'INSERT INTO categories (name, color) VALUES (?, ?)',
    [name, color]
  );
  // mysql2 returns OkPacket as fields not rows; re-query the inserted row
  const { rows } = await db.query('SELECT LAST_INSERT_ID() as id');
  const id = rows?.[0]?.id;
  return getCategoryById(id);
}

// PUBLIC_INTERFACE
async function updateCategory(id, data) {
  /** Update category by id. Expects partial {name?, color?}. */
  const current = await getCategoryById(id);
  if (!current) return null;
  const name = data.name ?? current.name;
  const color = data.color ?? current.color;
  await db.query('UPDATE categories SET name = ?, color = ?, updated_at = NOW() WHERE id = ?', [
    name,
    color,
    id,
  ]);
  return getCategoryById(id);
}

// PUBLIC_INTERFACE
async function deleteCategory(id) {
  /** Delete category by id. Returns boolean success. */
  const { rows } = await db.query('DELETE FROM categories WHERE id = ?', [id]);
  // rows is OkPacket; cannot rely on affectedRows via mysql2 execute return; re-run check
  const after = await getCategoryById(id);
  return !after;
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
