'use strict';

/**
 * Lightweight validation helpers to avoid heavy dependencies.
 * Each validator returns { valid: boolean, errors: string[] }
 */

function requireString(value, field, { min = 1, max = 255 } = {}) {
  const errors = [];
  if (typeof value !== 'string') errors.push(`${field} must be a string`);
  else {
    const len = value.trim().length;
    if (len < min) errors.push(`${field} must be at least ${min} characters`);
    if (len > max) errors.push(`${field} must be at most ${max} characters`);
  }
  return { valid: errors.length === 0, errors };
}

function optionalString(value, field, { max = 2000 } = {}) {
  if (value == null) return { valid: true, errors: [] };
  return requireString(String(value), field, { min: 0, max });
}

function optionalBoolean(value, field) {
  if (value == null) return { valid: true, errors: [] };
  const isBool = typeof value === 'boolean' || value === 0 || value === 1;
  return { valid: isBool, errors: isBool ? [] : [`${field} must be boolean`] };
}

function optionalInteger(value, field, { min = null, max = null } = {}) {
  if (value == null) return { valid: true, errors: [] };
  const num = Number(value);
  const errors = [];
  if (!Number.isInteger(num)) errors.push(`${field} must be integer`);
  if (min != null && num < min) errors.push(`${field} must be >= ${min}`);
  if (max != null && num > max) errors.push(`${field} must be <= ${max}`);
  return { valid: errors.length === 0, errors };
}

function optionalDateTime(value, field) {
  if (value == null) return { valid: true, errors: [] };
  const d = new Date(value);
  const valid = !isNaN(d.getTime());
  return { valid, errors: valid ? [] : [`${field} must be a valid date-time`] };
}

function collect(...results) {
  const errors = results.flatMap(r => r.errors);
  return { valid: errors.length === 0, errors };
}

module.exports = {
  requireString,
  optionalString,
  optionalBoolean,
  optionalInteger,
  optionalDateTime,
  collect,
};
