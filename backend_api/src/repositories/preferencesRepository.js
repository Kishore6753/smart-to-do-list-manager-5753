'use strict';

const db = require('../db/mysql');

/**
 * Simple key-value preferences per user (user_id, key, value).
 */

// PUBLIC_INTERFACE
async function getPreferences(userId) {
  /** Get all preferences for a user as object map. */
  const { rows } = await db.query(
    'SELECT pref_key as `key`, pref_value as `value` FROM user_preferences WHERE user_id = ?',
    [userId]
  );
  const map = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

// PUBLIC_INTERFACE
async function setPreferences(userId, prefsObj) {
  /** Upsert preferences for user. prefsObj is a plain object. */
  const entries = Object.entries(prefsObj || {});
  if (!entries.length) return getPreferences(userId);
  return db.transaction(async (conn) => {
    for (const [key, value] of entries) {
      await conn.execute(
        `INSERT INTO user_preferences (user_id, pref_key, pref_value)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE pref_value = VALUES(pref_value), updated_at = NOW()`,
        [userId, key, String(value)]
      );
    }
    const [rows] = await conn.execute(
      'SELECT pref_key as `key`, pref_value as `value` FROM user_preferences WHERE user_id = ?',
      [userId]
    );
    const map = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  });
}

module.exports = {
  getPreferences,
  setPreferences,
};
