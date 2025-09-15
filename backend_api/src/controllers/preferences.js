'use strict';

const service = require('../services/preferences');

class PreferencesController {
  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Get preferences for user_id. For demo, user_id is provided via query or default 1. */
    try {
      const userId = Number(req.params.userId);
      const data = await service.getUserPreferences(userId);
      res.json(data);
    } catch (err) { next(err); }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Update preferences for user_id. Expects key-value object. */
    try {
      const userId = Number(req.params.userId);
      const data = await service.updateUserPreferences(userId, req.body || {});
      res.json(data);
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ message: err.message, errors: err.details || [] });
      next(err);
    }
  }
}

module.exports = new PreferencesController();
