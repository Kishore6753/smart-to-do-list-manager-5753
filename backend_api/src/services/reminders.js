'use strict';

const remindersRepo = require('../repositories/remindersRepository');
const { optionalInteger, optionalDateTime, optionalString, collect } = require('../utils/validators');

// PUBLIC_INTERFACE
async function listReminders(taskId) {
  /** List reminders with optional task filter. */
  return remindersRepo.listReminders(taskId);
}

// PUBLIC_INTERFACE
async function getReminder(id) {
  /** Get reminder by id. */
  return remindersRepo.getReminderById(id);
}

// PUBLIC_INTERFACE
async function createReminder(payload) {
  /** Validate and create reminder. Requires task_id and remind_at. */
  const v = collect(
    optionalInteger(payload.task_id, 'task_id', { min: 1 }),
    optionalDateTime(payload.remind_at, 'remind_at'),
    optionalString(payload.method, 'method', { max: 50 }),
  );
  if (!payload.task_id || !payload.remind_at) {
    const err2 = new Error('task_id and remind_at are required');
    err2.status = 400;
    throw err2;
  }
  if (!v.valid) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = v.errors;
    throw err;
  }
  return remindersRepo.createReminder(payload);
}

// PUBLIC_INTERFACE
async function updateReminder(id, payload) {
  /** Validate and update reminder. */
  const v = collect(
    optionalInteger(payload.task_id, 'task_id', { min: 1 }),
    optionalDateTime(payload.remind_at, 'remind_at'),
    optionalString(payload.method, 'method', { max: 50 }),
  );
  if (!v.valid) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = v.errors;
    throw err;
  }
  return remindersRepo.updateReminder(id, payload);
}

// PUBLIC_INTERFACE
async function deleteReminder(id) {
  /** Delete reminder. */
  return remindersRepo.deleteReminder(id);
}

module.exports = {
  listReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
};
