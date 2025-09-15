'use strict';

const express = require('express');
const controller = require('../controllers/preferences');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Preferences
 *   description: User Preferences
 */

router.get('/:userId', controller.get.bind(controller));
router.put('/:userId', controller.update.bind(controller));

module.exports = router;
