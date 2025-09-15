'use strict';

const tasksRepo = require('../repositories/tasksRepository');
const { requireString, optionalString, optionalBoolean, optionalInteger, optionalDateTime, collect } = require('../utils/validators');

// PUBLIC_INTERFACE
async function listTasks(filters) {
  /** List tasks with optional filters. */
  return tasksRepo.listTasks(filters || {});
}

// PUBLIC_INTERFACE
async function getTask(id) {
  /** Get task by id. */
  return tasksRepo.getTaskById(id);
}

// PUBLIC_INTERFACE
async function createTask(payload) {
  /** Validate and create task. Requires title. */
  const v = collect(
    requireString(payload.title, 'title', { min: 1, max: 255 }),
    optionalString(payload.description, 'description', { max: 4000 }),
    optionalDateTime(payload.due_date, 'due_date'),
    optionalInteger(payload.priority, 'priority', { min: 0, max: 5 }),
    optionalBoolean(payload.completed, 'completed'),
    optionalInteger(payload.category_id, 'category_id', { min: 1 }),
    optionalInteger(payload.order_index, 'order_index', { min: 0 }),
  );
  if (!v.valid) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = v.errors;
    throw err;
  }
  return tasksRepo.createTask(payload);
}

// PUBLIC_INTERFACE
async function updateTask(id, payload) {
  /** Validate partial update and apply. */
  const v = collect(
    payload.title !== undefined ? requireString(payload.title, 'title', { min: 1, max: 255 }) : { valid: true, errors: [] },
    optionalString(payload.description, 'description', { max: 4000 }),
    optionalDateTime(payload.due_date, 'due_date'),
    optionalInteger(payload.priority, 'priority', { min: 0, max: 5 }),
    optionalBoolean(payload.completed, 'completed'),
    optionalInteger(payload.category_id, 'category_id', { min: 1 }),
    optionalInteger(payload.order_index, 'order_index', { min: 0 }),
  );
  if (!v.valid) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = v.errors;
    throw err;
  }
  return tasksRepo.updateTask(id, payload);
}

// PUBLIC_INTERFACE
async function deleteTask(id) {
  /** Delete a task. */
  return tasksRepo.deleteTask(id);
}

// PUBLIC_INTERFACE
async function reorderTasks(orderArray) {
  /** Reorder tasks - basic array validation. */
  if (!Array.isArray(orderArray)) {
    const err = new Error('Invalid body: expected array of {id, order_index}');
    err.status = 400;
    throw err;
  }
  return tasksRepo.reorderTasks(orderArray);
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
};
