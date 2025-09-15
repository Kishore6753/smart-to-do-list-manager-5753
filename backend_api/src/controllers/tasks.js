'use strict';

const service = require('../services/tasks');

class TasksController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** List tasks with filters. */
    try {
      const filters = {
        category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
        completed: req.query.completed !== undefined ? req.query.completed === 'true' : undefined,
        q: req.query.q,
      };
      const data = await service.listTasks(filters);
      res.json(data);
    } catch (err) { next(err); }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Get task by id. */
    try {
      const data = await service.getTask(Number(req.params.id));
      if (!data) return res.status(404).json({ message: 'Task not found' });
      res.json(data);
    } catch (err) { next(err); }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Create a new task. */
    try {
      const data = await service.createTask(req.body || {});
      res.status(201).json(data);
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ message: err.message, errors: err.details || [] });
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Update task by id. */
    try {
      const data = await service.updateTask(Number(req.params.id), req.body || {});
      if (!data) return res.status(404).json({ message: 'Task not found' });
      res.json(data);
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ message: err.message, errors: err.details || [] });
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Delete task by id. */
    try {
      const ok = await service.deleteTask(Number(req.params.id));
      if (!ok) return res.status(404).json({ message: 'Task not found' });
      res.status(204).send();
    } catch (err) { next(err); }
  }

  // PUBLIC_INTERFACE
  async reorder(req, res, next) {
    /** Reorder tasks by array of {id, order_index}. */
    try {
      const ok = await service.reorderTasks(req.body || []);
      res.json({ success: !!ok });
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ message: err.message });
      next(err);
    }
  }
}

module.exports = new TasksController();
