'use strict';

const db = require('../db/mysql');

// PUBLIC_INTERFACE
async function listTasks(filters = {}) {
  /** List tasks with optional filters: {category_id, completed, q}. */
  const where = [];
  const params = [];
  if (filters.category_id) {
    where.push('t.category_id = ?');
    params.push(filters.category_id);
  }
  if (typeof filters.completed === 'boolean') {
    where.push('t.completed = ?');
    params.push(filters.completed ? 1 : 0);
  }
  if (filters.q) {
    where.push('(t.title LIKE ? OR t.description LIKE ?)');
    params.push(`%${filters.q}%`, `%${filters.q}%`);
  }
  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const { rows } = await db.query(
    `SELECT t.id, t.title, t.description, t.due_date, t.priority, t.completed, t.order_index,
            t.category_id, c.name as category_name, c.color as category_color,
            t.created_at, t.updated_at
       FROM tasks t
       LEFT JOIN categories c ON c.id = t.category_id
       ${whereClause}
       ORDER BY t.order_index ASC, t.created_at DESC`,
    params
  );
  return rows;
}

// PUBLIC_INTERFACE
async function getTaskById(id) {
  /** Get a task by id. */
  const { rows } = await db.query(
    `SELECT t.id, t.title, t.description, t.due_date, t.priority, t.completed, t.order_index,
            t.category_id, t.created_at, t.updated_at
       FROM tasks t WHERE t.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function createTask(data) {
  /** Create task. Expects {title, description?, due_date?, priority?, completed?, category_id?, order_index?} */
  const {
    title,
    description = null,
    due_date = null,
    priority = null,
    completed = false,
    category_id = null,
    order_index = null,
  } = data;

  await db.query(
    `INSERT INTO tasks (title, description, due_date, priority, completed, category_id, order_index)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, due_date, priority, completed ? 1 : 0, category_id, order_index]
  );
  const { rows } = await db.query('SELECT LAST_INSERT_ID() as id');
  const id = rows?.[0]?.id;
  return getTaskById(id);
}

// PUBLIC_INTERFACE
async function updateTask(id, data) {
  /** Update task with partial fields. */
  const current = await getTaskById(id);
  if (!current) return null;

  const payload = {
    title: data.title ?? current.title,
    description: data.description ?? current.description,
    due_date: data.due_date ?? current.due_date,
    priority: data.priority ?? current.priority,
    completed: typeof data.completed === 'boolean' ? (data.completed ? 1 : 0) : current.completed,
    category_id: data.category_id ?? current.category_id,
    order_index: data.order_index ?? current.order_index,
  };

  await db.query(
    `UPDATE tasks
       SET title = ?, description = ?, due_date = ?, priority = ?, completed = ?, category_id = ?, order_index = ?, updated_at = NOW()
     WHERE id = ?`,
    [
      payload.title,
      payload.description,
      payload.due_date,
      payload.priority,
      payload.completed,
      payload.category_id,
      payload.order_index,
      id,
    ]
  );
  return getTaskById(id);
}

// PUBLIC_INTERFACE
async function deleteTask(id) {
  /** Delete task by id. Returns boolean. */
  await db.query('DELETE FROM tasks WHERE id = ?', [id]);
  const after = await getTaskById(id);
  return !after;
}

// PUBLIC_INTERFACE
async function reorderTasks(orderArray) {
  /** Reorder tasks using array of {id, order_index}. Executes in a transaction. */
  return db.transaction(async (conn) => {
    for (const item of orderArray) {
      await conn.execute('UPDATE tasks SET order_index = ?, updated_at = NOW() WHERE id = ?', [
        item.order_index,
        item.id,
      ]);
    }
    return true;
  });
}

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
};
