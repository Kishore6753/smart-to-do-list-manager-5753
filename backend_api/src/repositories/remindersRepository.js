'use strict';

const db = require('../db/mysql');

// PUBLIC_INTERFACE
async function listReminders(taskId = null) {
  /** List reminders; optional filter by taskId. */
  const where = [];
  const params = [];
  if (taskId) {
    where.push('r.task_id = ?');
    params.push(taskId);
  }
  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const { rows } = await db.query(
    `SELECT r.id, r.task_id, r.remind_at, r.method, r.created_at, r.updated_at
       FROM reminders r
       ${whereClause}
       ORDER BY r.remind_at ASC`,
    params
  );
  return rows;
}

// PUBLIC_INTERFACE
async function getReminderById(id) {
  /** Get reminder by id. */
  const { rows } = await db.query(
    'SELECT id, task_id, remind_at, method, created_at, updated_at FROM reminders WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function createReminder(data) {
  /** Create reminder. Expects {task_id, remind_at, method?} */
  const { task_id, remind_at, method = 'email' } = data;
  await db.query('INSERT INTO reminders (task_id, remind_at, method) VALUES (?, ?, ?)', [
    task_id,
    remind_at,
    method,
  ]);
  const { rows } = await db.query('SELECT LAST_INSERT_ID() as id');
  const id = rows?.[0]?.id;
  return getReminderById(id);
}

// PUBLIC_INTERFACE
async function updateReminder(id, data) {
  /** Update reminder; partial allowed. */
  const current = await getReminderById(id);
  if (!current) return null;
  const method = data.method ?? current.method;
  const remind_at = data.remind_at ?? current.remind_at;
  await db.query(
    'UPDATE reminders SET method = ?, remind_at = ?, updated_at = NOW() WHERE id = ?',
    [method, remind_at, id]
  );
  return getReminderById(id);
}

// PUBLIC_INTERFACE
async function deleteReminder(id) {
  /** Delete reminder by id. Returns boolean. */
  await db.query('DELETE FROM reminders WHERE id = ?', [id]);
  const after = await getReminderById(id);
  return !after;
}

module.exports = {
  listReminders,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
};
