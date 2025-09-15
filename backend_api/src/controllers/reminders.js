'use strict';

const service = require('../services/reminders');

class RemindersController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** List reminders, optionally filtered by task_id. */
    try {
      const taskId = req.query.task_id ? Number(req.query.task_id) : null;
      const data = await service.listReminders(taskId);
      res.json(data);
    } catch (err) { next(err); }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Get reminder by id. */
    try {
      const data = await service.getReminder(Number(req.params.id));
      if (!data) return res.status(404).json({ message: 'Reminder not found' });
      res.json(data);
    } catch (err) { next(err); }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Create reminder. */
    try {
      const data = await service.createReminder(req.body || {});
      res.status(201).json(data);
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ message: err.message, errors: err.details || [] });
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Update reminder by id. */
    try {
      const data = await service.updateReminder(Number(req.params.id), req.body || {});
      if (!data) return res.status(404).json({ message: 'Reminder not found' });
      res.json(data);
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ message: err.message, errors: err.details || [] });
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Delete reminder by id. */
    try {
      const ok = await service.deleteReminder(Number(req.params.id));
      if (!ok) return res.status(404).json({ message: 'Reminder not found' });
      res.status(204).send();
    } catch (err) { next(err); }
  }
}

module.exports = new RemindersController();
