'use strict';

const prefsRepo = require('../repositories/preferencesRepository');
const { optionalString, collect } = require('../utils/validators');

// PUBLIC_INTERFACE
async function getUserPreferences(userId) {
  /** Get preferences map for given user id. */
  return prefsRepo.getPreferences(userId);
}

// PUBLIC_INTERFACE
async function updateUserPreferences(userId, payload) {
  /** Update preferences; payload must be an object map. */
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    const err = new Error('Payload must be an object of key-value pairs');
    err.status = 400;
    throw err;
  }
  // Basic key validation
  const keys = Object.keys(payload);
  if (!keys.length) return prefsRepo.getPreferences(userId);
  const errors = [];
  for (const k of keys) {
    const v = optionalString(k, 'preference key', { max: 100 });
    if (!v.valid) errors.push(...v.errors);
  }
  if (errors.length) {
    const err = new Error('Validation failed');
    err.status = 400;
    err.details = errors;
    throw err;
  }
  return prefsRepo.setPreferences(userId, payload);
}

module.exports = {
  getUserPreferences,
  updateUserPreferences,
};
