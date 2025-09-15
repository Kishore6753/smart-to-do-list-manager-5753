'use strict';

const express = require('express');
const controller = require('../controllers/reminders');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Reminder management
 */

router.get('/', controller.list.bind(controller));
router.get('/:id', controller.get.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.remove.bind(controller));

module.exports = router;
