const express = require('express');
const healthController = require('../controllers/health');
const tasksRoutes = require('./tasks');
const categoriesRoutes = require('./categories');
const remindersRoutes = require('./reminders');
const preferencesRoutes = require('./preferences');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount feature routers
router.use('/tasks', tasksRoutes);
router.use('/categories', categoriesRoutes);
router.use('/reminders', remindersRoutes);
router.use('/preferences', preferencesRoutes);

module.exports = router;
