'use strict';

/**
 * Simple Express server for Smart To-Do List Manager (minimal scaffold).
 * - Binds to process.env.PORT or 3001 (default).
 * - GET /        -> Plain text identifying the app.
 * - GET /health  -> JSON { status: 'ok' } for health checks.
 */

const express = require('express');

const app = express();

// Middleware: basic JSON parsing (future-proofing for later features)
app.use(express.json());

// Root route: identify the app
// PUBLIC_INTERFACE
app.get('/', (req, res) => {
  /** Returns a simple identification message for the root endpoint. */
  res.type('text/plain').send('Smart To-Do List Manager API (minimal scaffold) is running.');
});

// Health check: used by container orchestrators
// PUBLIC_INTERFACE
app.get('/health', (req, res) => {
  /**
   * Health check endpoint.
   * Returns:
   *   200 OK with JSON: { status: 'ok' }
   */
  res.status(200).json({ status: 'ok' });
});

// Pick up port from env or default to 3001
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Start server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Smart To-Do List Manager backend listening on port ${PORT}`);
});

// Export app for potential future testing/integration
module.exports = app;
